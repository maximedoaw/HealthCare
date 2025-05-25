import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCgZzlGw5_9p3oqvkWI5mofOcPTpUPX5BQ",
  authDomain: "chez-florav2.firebaseapp.com",
  projectId: "chez-florav2",
  storageBucket: "chez-florav2.firebasestorage.app",
  messagingSenderId: "922883686653",
  appId: "1:922883686653:web:54e7cd5c45b0ef3ddefe94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)
export const auth = getAuth(app)