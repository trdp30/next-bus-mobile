import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {catchError} from './catchError';

export const initializeGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId:
      '416876094817-4fhho62899cgsk9s87dkdsa2olbgvu0v.apps.googleusercontent.com',
    // webClientId: 'autoDetect',
  });
};

export async function signInWithGoogle() {
  try {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const signInResult = await GoogleSignin.signIn();

    // Try the new style of google-sign in result, from v13+ of that module
    let idToken = signInResult.data?.idToken;
    if (!idToken) {
      // if you are using older versions of google-signin, try old style result
      idToken = signInResult.idToken;
    }
    if (!idToken) {
      throw new Error('No ID token found');
    }

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  } catch (error) {
    let errorMessage = error?.message;
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          errorMessage = 'Sign in already in progress';
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          errorMessage =
            'Play services not available or outdated. Please update your Google Play Services.';

          break;
        case '7':
          errorMessage =
            'Network error occurred. Please check you internet connection.';
          break;
        default:
          errorMessage =
            'Google signin failed with a status code: ' + String(error?.code);
          break;
      }
    } else {
      errorMessage = 'Google signin failed. ' + (error?.code || error?.message);
    }
    const err = new Error(errorMessage);
    catchError(err);
    return {error: err};
  }
}

export async function googleSignOut() {
  return await GoogleSignin.revokeAccess();
}
