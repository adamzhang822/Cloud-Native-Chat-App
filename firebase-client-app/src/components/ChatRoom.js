import React, { useState, useEffect } from "react";
import "../App.css";
import { db, firebaseAuth, firestore, analytics } from "../firebase/config";
import { useCollection } from "react-firebase-hooks/firestore";
import { ChatMessage } from "./ChatMessage";
import firebase from "firebase/compat/app";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { logEvent } from "firebase/analytics";

export const ChatRoom = (props) => {
  const { channelId, changeThreadToShow, changeThreadChannel } = props;

  const messagesRef = firestore.collection(`channels/${channelId}/messages`);
  const query = messagesRef.orderBy("createdAt");
  const [messages] = useCollection(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  useEffect(() => {
    const visitRoom = async () => {
      const { uid } = firebaseAuth.currentUser;
      const docRef = doc(db, "users", uid);

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const visited = data.visited;
          if (visited) {
            if (!visited.includes(channelId)) {
              visited.push(channelId);
              await updateDoc(docRef, { visited: visited });
            }
          } else {
            const newVisited = [channelId];
            await updateDoc(docRef, { visited: newVisited });
          }
        } else {
          return;
        }
      } catch (error) {
        console.error(error);
      }
    };

    try {
      visitRoom();
    } catch (error) {
      console.error(error);
    }
    // Step 2: If user has not visited this chat room before, add to visited list
  }, [channelId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL, email } = firebaseAuth.currentUser;

    if (formValue.includes("taboo")) {
      logEvent(analytics, "censor_event", {
        orig_text: formValue,
        channelId: channelId,
        uid: uid,
      });
    }

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      email,
      photoURL,
    });

    setFormValue("");
  };

  return (
    <div className="chatRoom">
      <div className="chatRoomContents">
        <main>
          {messages && messages.docs.length > 0 ? (
            messages.docs.map((msg) => (
              <ChatMessage
                key={msg.id}
                id={msg.id}
                channelId={channelId}
                message={msg.data()}
                changeThreadToShow={changeThreadToShow}
                changeThreadChannel={changeThreadChannel}
              />
            ))
          ) : (
            <h1>Post something!</h1>
          )}
        </main>

        <form className="messageForm" onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="say something nice"
          />

          <button type="submit" disabled={!formValue}>
            🕊️
          </button>
        </form>
      </div>
    </div>
  );
};
