import React from "react";
import { useState } from "react";
import "../App.css";
import { firebaseAuth, db } from "../firebase/config";
import firebase from "firebase/compat/app";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
export const SignUp = () => {
  return <div></div>;
};

export const SignOut = () => {
  return (
    firebaseAuth.currentUser && (
      <button className="sign-out" onClick={() => firebaseAuth.signOut()}>
        Sign Out
      </button>
    )
  );
};

export const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const createNewUserDoc = async () => {
    const { uid, photoURL, email } = firebaseAuth.currentUser;
    await setDoc(doc(db, "users", uid), {
      uid: uid,
      email: email,
      photoURL: photoURL,
    });
  };

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      // Step 1: Try to sign up or login through gmail
      await firebaseAuth.signInWithPopup(provider);

      // Step 2: Check if user is new
      const { uid } = firebaseAuth.currentUser;
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await createNewUserDoc();
      }
      return;
    } catch (error) {
      console.log("error", error);
    }
  };

  const onChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, username, password);
    } catch (error) {
      console.log("error", error);
    }
  };

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(firebaseAuth, username, password);
      const { uid } = firebaseAuth.currentUser;
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await createNewUserDoc();
      }
      return;
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <h1>Sign up or login to Firebase app! </h1>
      <div>
        Username:
        <input
          type="text"
          name="username"
          value={username}
          onChange={onChangeUsername}
        />
      </div>
      <div>
        Password:
        <input
          type="text"
          name="password"
          value={password}
          onChange={onChangePassword}
        />
      </div>
      <button className="sign-in" onClick={signUp}>
        Sign up
      </button>
      <button className="sign-in" onClick={login}>
        Log In
      </button>
      <button className="sign-in" onClick={signInWithGoogle}>
        Log In with Google
      </button>
    </div>
  );
};
