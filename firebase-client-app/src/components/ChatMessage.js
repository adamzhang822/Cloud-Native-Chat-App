import { useState, React } from "react";
import "../App.css";

import { firebaseAuth, db, storage, analytics } from "../firebase/config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { logEvent } from "firebase/analytics";
import { v4 } from "uuid";

export const ChatMessage = (props) => {
  const { message, id, channelId, changeThreadToShow, changeThreadChannel } =
    props;
  const { text, uid, photoURL, email, createdAt, imageURL } = message;
  const [isEditing, setIsEditing] = useState(false);
  const [messageText, setMessageText] = useState("");

  const [imageUpload, setImageUpload] = useState(null);

  let timestamp;
  timestamp = createdAt
    ? new Date(createdAt.seconds * 1000).toLocaleString()
    : "";

  const messageClass =
    uid === firebaseAuth.currentUser.uid ? "sent" : "received";
  const ownerOfMessage = messageClass === "sent";

  const deleteMessage = async () => {
    await deleteDoc(doc(db, "channels", channelId, "messages", id));
  };

  const editMessage = async () => {
    setIsEditing(true);
  };

  const handleEditSubmission = async () => {
    await updateDoc(doc(db, "channels", channelId, "messages", id), {
      text: messageText,
      editedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setIsEditing(false);
    setMessageText("");
  };

  const uploadImage = async () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `${imageUpload.name + v4()}`);
    try {
      await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(imageRef);
      await updateDoc(doc(db, "channels", channelId, "messages", id), {
        imageURL: url,
        editedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      await logEvent(analytics, "new_image_upload", {
        channel_id: channelId,
        uid: uid,
      });
    } catch (e) {
      console.error(e);
    }
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
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="say something nice"
            />
          )}
          {imageURL && <img src={imageURL} alt="attachment" />}
        </div>
      </div>
      <div className="messageActions">
        {ownerOfMessage && <button onClick={deleteMessage}>Delete</button>}
        {ownerOfMessage &&
          (!isEditing ? (
            <button onClick={editMessage}>Edit</button>
          ) : (
            <button onClick={handleEditSubmission}>Submit Edit</button>
          ))}
        {ownerOfMessage && (
          <input
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}
          />
        )}
        {ownerOfMessage && <button onClick={uploadImage}>Attach Image</button>}
        <button
          onClick={() => {
            changeThreadToShow(id);
            changeThreadChannel(channelId);
          }}
        >
          Show Replies
        </button>
      </div>
    </div>
  );
};
