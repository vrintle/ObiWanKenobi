// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "leetcode-contest-ranks-fc79d.firebaseapp.com",
  databaseURL: "https://leetcode-contest-ranks-fc79d-default-rtdb.firebaseio.com",
  projectId: "leetcode-contest-ranks-fc79d",
  storageBucket: "leetcode-contest-ranks-fc79d.appspot.com",
  messagingSenderId: "1095213176408",
  appId: "1:1095213176408:web:59a38a46a3859a60fb5c2d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
}
