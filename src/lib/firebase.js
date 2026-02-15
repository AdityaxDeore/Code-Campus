// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Validate required environment variables in production
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

if (import.meta.env.PROD) {
  const missing = requiredEnvVars.filter(v => !import.meta.env[v]);
  if (missing.length > 0) {
    console.error(`[Firebase] Missing required environment variables: ${missing.join(', ')}`);
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Warn if required Firebase config is missing
if (!firebaseConfig.apiKey) {
  console.warn('Missing VITE_FIREBASE_API_KEY environment variable. See .env.example for reference.');
}
if (!firebaseConfig.projectId) {
  console.warn('Missing VITE_FIREBASE_PROJECT_ID environment variable. See .env.example for reference.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
// Wrapped in try/catch because ad blockers and CSP policies can
// prevent analytics from loading — this must never break the app.
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[Firebase] Analytics failed to initialise:', err);
    }
  }
}
export { analytics };

export default app;
