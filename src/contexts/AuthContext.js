import auth from '@react-native-firebase/auth';
import React, {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AuthenticationLoader from '../components/AuthenticationLoader';
import {
  selectFbUser,
  selectUser,
  selectUserCurrentRole,
  selectUserDataLoaded,
} from '../store/selectors/session.selector';
import {authenticated, unauthenticated} from '../store/slices/session';
import {catchError} from '../utils/catchError';
import {
  googleSignOut,
  initializeGoogleSignIn,
  signInWithGoogle,
} from '../utils/googleSignIn';

initializeGoogleSignIn();

export const AuthContext = createContext({
  isAuthenticated: false,
  isAuthenticating: true,
  user: {},
  signInWithGoogle,
});

function AuthProvider(props) {
  const [isAuthenticated, toggleAuthenticated] = useState(false);
  const [isAuthenticating, toggleAuthenticating] = useState(true);
  const [user, setUser] = useState();
  const currentUser = useSelector(selectUser);
  const fbUser = useSelector(selectFbUser);
  const userDataLoaded = useSelector(selectUserDataLoaded);
  const currentRole = useSelector(selectUserCurrentRole);
  const dispatch = useDispatch();

  // Handle user state changes
  const onAuthStateChanged = useCallback(
    data => {
      setUser(data?.toJSON ? data?.toJSON() : data);
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
      auth()
        .currentUser?.getIdToken()
        .then(() => {
          toggleAuthenticated(true);
          return user;
        })
        .then(data => dispatch(authenticated(data)))
        .catch(error => {
          // Todo: Have to handle the error format
          catchError(error);
          toggleAuthenticated(false);
          toggleAuthenticating(false);
        });
    } else {
      toggleAuthenticated(false);
    }
  }, [user, dispatch, isAuthenticating]);

  // const signInAnonymously = () => {
  //   return auth()
  //     .signInAnonymously()
  //     .then(() => {
  //       console.log('User signed in anonymously');
  //     })
  //     .catch(error => {
  //       if (error.code === 'auth/operation-not-allowed') {
  //         console.log('Enable anonymous in your firebase console.');
  //       }
  //       console.error(error);
  //     });
  // };

  const signInWithEmailPassword = async ({email, password}) => {
    try {
      const res = await auth().signInWithEmailAndPassword(email, password);
      return res;
    } catch (error) {
      let errorMessage = error?.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'That email address is already in use!';
      }
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'That email address is invalid!';
      }
      // Todo: Have to handle the error format
      catchError(Error(errorMessage));
      return {error: errorMessage};
    }
  };

  const handleSignInWithCustomToken = useCallback(
    async token => {
      try {
        toggleAuthenticating(true);
        await signOut();
        await auth().signInWithCustomToken(token);
        toggleAuthenticating(false);
      } catch (error) {
        // Todo: Handle the error format
        console.log('handleSignInWithCustomToken error', error);
        toggleAuthenticating(false);
      }
    },
    [signOut, toggleAuthenticating],
  );

  const signOut = useCallback(() => {
    return (
      auth()
        .signOut()
        .then(() => dispatch(unauthenticated()))
        .then(googleSignOut)
        .then(() => console.log('User signed out!'))
        //Todo: handle logout error cases
        .catch(error => console.error('Error while signinOut', error))
    );
  }, [dispatch]);

  const value = useMemo(() => {
    return {
      isAuthenticated,
      isAuthenticating,
      user: currentUser,
      fbUser: fbUser,
      userDataLoaded,
      // signInAnonymously,
      signInWithEmailPassword,
      signOut,
      signInWithGoogle,
      currentRole,
      handleSignInWithCustomToken,
    };
  }, [
    isAuthenticated,
    isAuthenticating,
    currentUser,
    fbUser,
    userDataLoaded,
    signOut,
    currentRole,
    handleSignInWithCustomToken,
  ]);

  if (isAuthenticating) {
    return <AuthenticationLoader />;
  }

  if (isAuthenticated && !userDataLoaded) {
    return <AuthenticationLoader />;
  }

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}

export default AuthProvider;
