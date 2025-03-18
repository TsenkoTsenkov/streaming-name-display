// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import { getAnalytics } from "firebase/analytics"

// Your web app's Firebase configuration
// Using environment variables for security
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
};

// Log the Firebase config (hiding sensitive values)
console.log('Firebase config loaded:', { 
  apiKey: '***' + (process.env.REACT_APP_FIREBASE_API_KEY || '').slice(-4), 
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
// Only initialize analytics if in a browser environment and not in testing
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
  getAnalytics(app);
}

// Helper functions for database operations
export const saveData = (path, data) => {
  console.log(`Saving data to Firebase path: ${path}`, data);
  return set(ref(database, path), data)
    .then(() => {
      console.log(`Data saved successfully to ${path}`);
      return true;
    })
    .catch(error => {
      console.error(`Error saving data to ${path}:`, error);
      throw error;
    });
};

export const getData = async (path) => {
  console.log(`Getting data from Firebase path: ${path}`);
  try {
    const snapshot = await get(ref(database, path));
    const data = snapshot.val();
    console.log(`Retrieved data from ${path}:`, data);
    return data;
  } catch (error) {
    console.error(`Error retrieving data from ${path}:`, error);
    throw error;
  }
};

export const listenToData = (path, callback) => {
  console.log(`Setting up listener for Firebase path: ${path}`);
  const dataRef = ref(database, path);
  return onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    console.log(`Real-time update received for ${path}:`, data);
    callback(data);
  }, error => {
    console.error(`Error in Firebase listener for ${path}:`, error);
  });
};

export default database; 