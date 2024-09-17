import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7gGfVFxwCLElpH4cv-_uXKnu0ascTimQ",
  authDomain: "realchat-cc4d4.firebaseapp.com",
  projectId: "realchat-cc4d4",
  storageBucket: "realchat-cc4d4.appspot.com",
  messagingSenderId: "950945953818",
  appId: "1:950945953818:web:86711a82dee46f6010b9a3",
  measurementId: "G-XT6JT3SGED"
};
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
