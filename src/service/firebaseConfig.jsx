// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPUbHJVmVnsNZXXuvHs-z7YR8k4Nsc7To",
  authDomain: "zipngo-a5098.firebaseapp.com",
  projectId: "zipngo-a5098",
  storageBucket: "zipngo-a5098.firebasestorage.app",
  messagingSenderId: "992272641561",
  appId: "1:992272641561:web:a80cdba07dc4397e84c488",
  measurementId: "G-ZZXXLD69XN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);