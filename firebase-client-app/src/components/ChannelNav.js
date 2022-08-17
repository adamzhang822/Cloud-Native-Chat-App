import React, { useState } from "react";
import "../App.css";

import { firestore } from "../firebase/config";
import { useCollection } from "react-firebase-hooks/firestore";
import ChannelButton from "./ChannelButton";
import firebase from "firebase/compat/app";

export const ChannelNav = (props) => {
  const { changeChannel } = props;
  const channelsRef = firestore.collection("channels");
  const query = channelsRef.orderBy("createdAt");
  const [channels] = useCollection(query, { idField: "id" });
  const [newChannelName, setNewChannelName] = useState("");

  const onChangeChannelNameInput = (event) => {
    setNewChannelName(event.target.value);
  };

  const createChannel = async (e) => {
    e.preventDefault();
    await channelsRef.add({
      name: newChannelName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setNewChannelName("");
  };

  return (
    <div className="channelNav">
      <h2>Channel List</h2>
      {channels &&
        channels.docs.map((channel) => {
          return (
            <ChannelButton
              key={channel.id}
              id={channel.id}
              name={channel.data().name}
              changeChannel={changeChannel}
            />
          );
        })}
      <div>
        New Channel Name:
        <input
          type="text"
          name="newChannelName"
          value={newChannelName}
          onChange={onChangeChannelNameInput}
        />
        <button onClick={createChannel}>Create New Channel!</button>
      </div>
    </div>
  );
};
