import React, {useContext, useState} from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  TextInput,
} from 'react-native';
import LoginLogo from '../components/LoginLogo';
import {Box} from '../components/ui/box';
import {Button, ButtonText} from '../components/ui/button';
import {Text} from '../components/ui/text';
import {AuthContext} from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, toggleLoading] = useState(false);
  const [error, setError] = useState(null);
  const {signInWithGoogle, isAuthenticating, signInWithEmailPassword} =
    useContext(AuthContext);

  const handleGoogleSignIn = async () => {
    try {
      toggleLoading(true);
      setError(null);
      await signInWithGoogle();
      toggleLoading(false);
    } catch (err) {
      setError(err.message);
      toggleLoading(false);
    }
  };

  const handleLogin = async () => {
    const trimmedEmail = (email || '').trim();
    const trimmedPassword = (password || '').trim();
    if (!trimmedEmail.length || !trimmedPassword.length) {
      return;
    }
    setError(null);
    toggleLoading(true);
    const res = await signInWithEmailPassword({
      email: trimmedEmail.toLowerCase(),
      password,
    });
    if (res.error) {
      setError(res.error);
    }
    toggleLoading(false);
  };

  return (
    <Box className="flex flex-1 items-center justify-center bg-white p-5">
      <StatusBar
        animated={true}
        backgroundColor="#eee"
        // barStyle={statusBarStyle}
        // showHideTransition={statusBarTransition}
        // hidden={hidden}
      />
      <Box className="flex flex-1 items-center justify-center">
        <LoginLogo style={styles.logo} />
        <Text className="my-4 text-3xl font-semibold">Next Bus</Text>
        <Text className="text-xl">Bring the road to your plam</Text>
      </Box>
      <Box className="flex w-full flex-1 items-center justify-start">
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={email}
          onChangeText={setEmail}
          editable={!isLoading}
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
          autoComplete="password"
        />

        <Button
          size="md"
          variant="solid"
          action="primary"
          className="w-full"
          onPress={handleLogin}
          isDisabled={isAuthenticating || isLoading}>
          <ButtonText>Login</ButtonText>
        </Button>

        <Text style={styles.orText}>or</Text>

        <Button
          size="md"
          variant="solid"
          action="primary"
          className="w-full"
          onPress={handleGoogleSignIn}
          isDisabled={isAuthenticating || isLoading}>
          <ButtonText>Sign in with Google</ButtonText>
        </Button>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {isAuthenticating && <ActivityIndicator style={styles.loading} />}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 20,
    padding: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  orText: {
    marginVertical: 15,
    fontSize: 16,
  },
  loading: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    textAlign: 'center',
    resizeMode: 'contain',
  },
});

export default Login;
