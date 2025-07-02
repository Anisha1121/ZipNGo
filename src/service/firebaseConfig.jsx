// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5Drq4FRqCl52nODyblDh1i153RXjfqpE",
  authDomain: "zipngo-bde8f.firebaseapp.com",
  projectId: "zipngo-bde8f",
  storageBucket: "zipngo-bde8f.firebasestorage.app",
  messagingSenderId: "185293717087",
  appId: "1:185293717087:web:0263cb7a50e556c9da65ea",
  measurementId: "G-ZQBL6ELXJK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);