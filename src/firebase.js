// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCM-Im_38fKe0BXeh73PcY-NZ64IrbktUs",
  authDomain: "finance-tracker-87199.firebaseapp.com",
  projectId: "finance-tracker-87199",
  storageBucket: "finance-tracker-87199.appspot.com",
  messagingSenderId: "218370081265",
  appId: "1:218370081265:web:4b8ac922cfe7726988c450",
  measurementId: "G-3JGY4FWZ9P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
