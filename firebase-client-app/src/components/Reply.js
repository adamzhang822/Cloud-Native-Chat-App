import { useState, React } from "react";
import "../App.css";

import { firebaseAuth, db } from "../firebase/config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";

export const Reply = (props) => {
  const { reply, id, channelId, threadId, isOrig } = props;
  const { text, uid, photoURL, email, createdAt, imageURL } = reply;
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState("");

  let timestamp;
  timestamp = createdAt
    ? new Date(createdAt.seconds * 1000).toLocaleString()
    : "";

  const messageClass =
    uid === firebaseAuth.currentUser.uid ? "sent" : "received";

  const ownerOfReply = messageClass === "sent";

  const deleteReply = async () => {
    await deleteDoc(
      doc(db, "channels", channelId, "messages", threadId, "replies", id)
    );
  };

  const editReply = async () => {
    setIsEditing(true);
  };

  const handleEditSubmission = async () => {
    let ref;
    if (isOrig) {
      ref = doc(db, "channels", channelId, "messages", threadId);
    } else {
      ref = doc(db, "channels", channelId, "messages", threadId, "replies", id);
    }
    await updateDoc(ref, {
      text: replyText,
      editedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setIsEditing(false);
    setReplyText("");
  };

  return (
    <div className="messageContainer">
      <div className={`message ${messageClass}`}>
        <div>
          <img
            className="profile"
            src={
              photoURL ||
              "https://storage.googleapis.com/belay-351316.appspot.com/blank-profile.webp"
            }
            alt="profile"
          />
        </div>
        <div>
          {email} - {timestamp}
          {!isEditing ? (
            <div className="message-text">{text}</div>
          ) : (
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="say something nice"
            />
          )}
          {imageURL && <img src={imageURL} alt="attachment" />}
        </div>
      </div>
      <div className="messageActions">
        {ownerOfReply && <button onClick={deleteReply}>Delete</button>}
        {ownerOfReply &&
          (!isEditing ? (
            <button onClick={editReply}>Edit Reply</button>
          ) : (
            <button onClick={handleEditSubmission}>Submit Edit</button>
          ))}
      </div>
    </div>
  );
};
