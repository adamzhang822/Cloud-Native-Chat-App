import React, { useState } from "react";
import "../App.css";

import { ChatRoom } from "./ChatRoom";
import { ReplyThread } from "./ReplyThread";
import { ChannelNav } from "./ChannelNav";

const Belay = (props) => {
  const { user } = props;
  const [channelId, setChannelId] = useState(null);
  const [showThread, setShowThread] = useState(false);
  const [threadChannelId, setThreadChannelId] = useState(null);
  const [threadId, setThreadId] = useState(null);

  const changeChannelToShow = (newId) => {
    setChannelId(newId);
  };

  const changeThreadChannel = (newId) => {
    setThreadChannelId(newId);
  };

  const changeThreadToShow = (newId) => {
    if (!showThread) {
      setShowThread(true);
    }
    setThreadId(newId);
  };

  const closeThread = () => {
    setThreadId(null);
    setShowThread(false);
  };

  return (
    <div>
      <div className="belay">
        <ChannelNav
          className="messageList"
          changeChannel={changeChannelToShow}
          user={user}
        />
        {!channelId ? (
          <h1 style={{ color: "white", lineHeight: 10, padding: 20 }}>
            Select a channel !
          </h1>
        ) : (
          <ChatRoom
            className="messageList"
            channelId={channelId}
            changeThreadChannel={changeThreadChannel}
            changeThreadToShow={changeThreadToShow}
          />
        )}
        {showThread && (
          <ReplyThread
            className="messageList"
            channelId={threadChannelId}
            threadId={threadId}
            closeThread={closeThread}
          />
        )}
      </div>
    </div>
  );
};

export default Belay;
