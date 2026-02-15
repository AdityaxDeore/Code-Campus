import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';

// Check if Firebase is initialized
const isFirebaseReady = () => {
  if (!auth) {
    console.warn('[Auth] Firebase not initialized. Check your .env configuration.');
    return false;
  }
  return true;
};

// Auth providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Sign up with email and password
export const signUpWithEmail = async (email, password, displayName) => {
  if (!isFirebaseReady()) return { user: null, error: 'Firebase not configured' };
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  if (!isFirebaseReady()) return { user: null, error: 'Firebase not configured' };
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  if (!isFirebaseReady()) return { user: null, error: 'Firebase not configured' };
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Sign in with GitHub
export const signInWithGitHub = async () => {
  if (!isFirebaseReady()) return { user: null, error: 'Firebase not configured' };
  
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Sign out
export const logOut = async () => {
  if (!isFirebaseReady()) return { error: 'Firebase not configured' };
  
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  if (!isFirebaseReady()) {
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  if (!isFirebaseReady()) return null;
  return auth.currentUser;
};
