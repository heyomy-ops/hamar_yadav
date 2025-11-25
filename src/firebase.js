import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCA1BISDVVsmEqX2OCVFOpSDYyOpJ48PTY",
  authDomain: "hamar-yadav.firebaseapp.com",
  projectId: "hamar-yadav",
  storageBucket: "hamar-yadav.firebasestorage.app",
  messagingSenderId: "508553436182",
  appId: "1:508553436182:web:0d62cd2907bf1e08552937",
  measurementId: "G-VM95LRVD7C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
