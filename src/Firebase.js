// src/firebase.js
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDwmg53NhV7y_Q___71kc5HUH5_QVtW5xo",
    authDomain: "chatapp-32f12.firebaseapp.com",
    databaseURL: "https://chatapp-32f12-default-rtdb.firebaseio.com",
    projectId: "chatapp-32f12",
    storageBucket: "chatapp-32f12.appspot.com",
    messagingSenderId: "147739605652",
    appId: "1:147739605652:web:3acc9a7993fe9fa463d281"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

