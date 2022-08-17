import React from "react";
import "../App.css";

import { firebaseAuth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { Auth, SignOut } from "./Auth";
import Belay from "./Belay";

const App = () => {
  const [user] = useAuthState(firebaseAuth);

  return (
    <div className="App">
      <header>
        <h1>Belay⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>{user ? <Belay user={user} /> : <Auth />}</section>
    </div>
  );
};

export default App;
