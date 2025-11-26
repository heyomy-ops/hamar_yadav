import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCA1BISDVVsmEqX2OCVFOpSDYyOpJ48PTY",
  authDomain: "hamar-yadav.firebaseapp.com",
  projectId: "hamar-yadav",
  storageBucket: "hamar-yadav.firebasestorage.app",
  messagingSenderId: "508553436182",
  appId: "1:508553436182:web:0d62cd2907bf1e08552937",
  measurementId: "G-VM95LRVD7C"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
