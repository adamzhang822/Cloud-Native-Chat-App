import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDRwanyZyGiSwKeHYPaArNwAKuu_ftu3P8",
  authDomain: "belay-351316.firebaseapp.com",
  projectId: "belay-351316",
  storageBucket: "belay-351316.appspot.com",
  messagingSenderId: "759342786605",
  appId: "1:759342786605:web:f0a2c2dd6f40bf0b68b0a4",
  measurementId: "G-RTHFK98ZK8",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseAuth = firebaseApp.auth();
export const firestore = firebaseApp.firestore();
