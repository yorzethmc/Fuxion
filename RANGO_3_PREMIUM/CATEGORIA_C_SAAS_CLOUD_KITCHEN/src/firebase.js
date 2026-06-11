import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDucTyhuPipb9mZDEL55GkfveOlHyG_yDc",
  authDomain: "fusion-culinaria.firebaseapp.com",
  projectId: "fusion-culinaria",
  storageBucket: "fusion-culinaria.firebasestorage.app",
  messagingSenderId: "1044943908073",
  appId: "1:1044943908073:web:b03d8f0aba5c3cdb739478",
  measurementId: "G-KXEKY8CEJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
