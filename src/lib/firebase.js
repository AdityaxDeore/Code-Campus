// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

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
