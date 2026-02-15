// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
<<<<<<< HEAD
=======
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

const missing = requiredEnvVars.filter(v => !import.meta.env[v]);
const hasValidConfig = missing.length === 0;

if (!hasValidConfig) {
  const errorMsg = `[Firebase] Missing required environment variables: ${missing.join(', ')}\n\nTo fix this:\n1. Copy .env.example to .env\n2. Add your Firebase credentials\n3. Restart the dev server`;
  console.error(errorMsg);
  
  // Show user-friendly error in development
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    window.__FIREBASE_CONFIG_ERROR__ = errorMsg;
  }
}

>>>>>>> 0d0d5e36f522f3ffc17ce7161060238ffadf0843
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

<<<<<<< HEAD
// Check if Firebase config has valid values (not placeholders)
const isValidConfig = 
  firebaseConfig.apiKey && 
  !firebaseConfig.apiKey.startsWith('your-') &&
  firebaseConfig.projectId && 
  !firebaseConfig.projectId.startsWith('your-');

// Initialize Firebase only with valid configuration
let app = null;
let auth = null;
let db = null;
let storage = null;
let analytics = null;

if (isValidConfig) {
=======
// Initialize Firebase (only if config is valid)
let app = null;
let auth = null;
let db = null;
let storage = null;

if (hasValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (err) {
    console.error('[Firebase] Initialization failed:', err);
  }
}

// Export Firebase services (will be null if config is missing)
export { auth, db, storage };

// Initialize Analytics (only in browser environment)
// Wrapped in try/catch because ad blockers and CSP policies can
// prevent analytics from loading — this must never break the app.
let analytics = null;
if (typeof window !== 'undefined' && app) {
>>>>>>> 0d0d5e36f522f3ffc17ce7161060238ffadf0843
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Initialize Analytics (only in browser environment)
    if (typeof window !== 'undefined') {
      try {
        analytics = getAnalytics(app);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn('[Firebase] Analytics failed to initialise:', err);
        }
      }
    }
  } catch (err) {
    console.error('[Firebase] Initialization failed:', err);
  }
} else {
  console.warn('⚠️ Firebase is disabled: missing or invalid configuration. Firebase services will not work until you update your .env file.');
}

export { auth, db, storage, analytics };

export default app;

export default app;
