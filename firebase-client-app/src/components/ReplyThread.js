import React, { useState } from "react";
import { analytics, db } from "../firebase/config";
import "../App.css";
import { doc } from "firebase/firestore";

import { firebaseAuth, firestore } from "../firebase/config";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import firebase from "firebase/compat/app";
import { Reply } from "./Reply";
import { logEvent } from "firebase/analytics";

export const ReplyThread = (props) => {
  const { channelId, threadId, closeThread } = props;
  const [formValue, setFormValue] = useState("");

  const repliesRef = firestore.collection(
    `channels/${channelId}/messages/${threadId}/replies`
  );
  const query = repliesRef.orderBy("createdAt");
  const [replies] = useCollection(query, { idField: "id" });
  const [origMsg] = useDocument(
    doc(db, "channels", channelId, "messages", threadId),
    {
      snapshotListenOptions: { includeMetaDataChange: false },
    }
  );

  const sendReply = async (e) => {
    e.preventDefault();

    const { uid, photoURL, email } = firebaseAuth.currentUser;
    if (formValue.includes("taboo")) {
      logEvent(analytics, "censor_reply", {
        uid: uid,
        orig_text: formValue,
        channel_id: channelId,
        threadId: threadId,
      });
    }
    await repliesRef.add({
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
      <button onClick={closeThread}>Close the thread!</button>
      <div className="chatRoomContents">
        <main>
          {origMsg && (
            <Reply id={threadId} reply={origMsg.data()} isOrig={true} />
          )}
          {replies &&
            replies.docs.map((rep) => (
              <Reply
                key={rep.id}
                id={rep.id}
                channelId={channelId}
                threadId={threadId}
                reply={rep.data()}
                isOrig={false}
              />
            ))}
        </main>

        <form className="messageForm" onSubmit={sendReply}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="reply to the thread!"
          />

          <button type="submit" disabled={!formValue}>
            🕊️
          </button>
        </form>
      </div>
    </div>
  );
};
