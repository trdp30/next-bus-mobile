import React, {
  useState,
  useEffect,
  createContext,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react';
import {Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import {initializeGoogleSignIn, signInWithGoogle} from '../utils/googleSignIn';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useDispatch, useSelector} from 'react-redux';
import {authenticated} from '../store/slices/session';
import { selectFbUser, selectUser } from '../store/selectors/session.selector';

initializeGoogleSignIn();

export const AuthContext = createContext({
  isAuthenticated: false,
  isAuthenticating: false,
  user: {},
  signInWithGoogle,
});

function AuthProvider(props) {
  const [isAuthenticated, toggleAuthenticated] = useState(false);
  const [isAuthenticating, toggleAuthenticating] = useState(false);
  const [user, setUser] = useState();
  const currentUser = useSelector(selectUser);
  const fbUser = useSelector(selectFbUser);
  const dispatch = useDispatch();

  // Handle user state changes
  const onAuthStateChanged = useCallback(
    data => {
      setUser(data);
      toggleAuthenticating(false);
    },
    [toggleAuthenticating, setUser],
  );

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
    // Todo: Have to handle unsubscribe logic
  }, [onAuthStateChanged]);

  useLayoutEffect(() => {
    if (user) {
      GoogleSignin.getTokens()
        .then(() => {
          toggleAuthenticated(true);
          return user.toJSON();
        })
        .then(data => dispatch(authenticated(data)))
        .catch(() => {
          toggleAuthenticated(false);
          toggleAuthenticating(false);
        });
    } else {
      toggleAuthenticated(false);
    }
  }, [user, dispatch]);

  const signInAnonymously = () => {
    return auth()
      .signInAnonymously()
      .then(() => {
        console.log('User signed in anonymously');
      })
      .catch(error => {
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
        }
        console.error(error);
      });
  };

  const signInWithEmailPassword = ({email, password}) => {
    return auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const signOut = () => {
    return auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  const value = useMemo(() => {
    return {
      isAuthenticated,
      isAuthenticating,
      user: currentUser,
      fbUser: fbUser,
      signInAnonymously,
      signInWithEmailPassword,
      signOut,
      signInWithGoogle,
    };
  }, [isAuthenticated, isAuthenticating, currentUser, fbUser]);

  if (isAuthenticating) {
    return <Text>Authenticating...</Text>;
  }

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}

export default AuthProvider;
