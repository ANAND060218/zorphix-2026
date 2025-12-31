import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase configuration
// You can find these in your Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
    apiKey: "AIzaSyBefhLPabmf4yo3RI-eCO7nAGhAq0dzZ1E",
    authDomain: "zorphix-26.firebaseapp.com",
    projectId: "zorphix-26",
    storageBucket: "zorphix-26.firebasestorage.app",
    messagingSenderId: "481146604346",
    appId: "1:481146604346:web:d40a55b61892b26742de03",
    measurementId: "G-QYQM2MM3W0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
