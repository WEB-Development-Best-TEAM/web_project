// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmiyusEjURhXUiA3kA_-hnIzOAjdCCnx4",
  authDomain: "decidawebgame.firebaseapp.com",
  projectId: "decidawebgame",
  storageBucket: "decidawebgame.firebasestorage.app",
  messagingSenderId: "611230898288",
  appId: "1:611230898288:web:573875792d11107bfebcb5",
  measurementId: "G-34C07BF853"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);