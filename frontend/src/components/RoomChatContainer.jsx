import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { useRoomChatStore } from "../store/useRoomChatStore";
import useRoomStore from "../store/useRoomStore";

const RoomChatContainer = () => {
  const { messages, getMessages, isMessagesLoading } = useRoomChatStore();
  const { currentRoom } = useRoomStore();
  const { authUser, socket } = useAuthStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(currentRoom?.roomId);

    socket.on("room-message", (message) => {
      // Only add message if it's for the current room
      if (message.roomId === currentRoom?.roomId) {
        useRoomChatStore.setState((state) => ({
          messages: [...state.messages, message],
        }));
      }
    });

    return () => {
      socket.off("room-message");
    };
  }, [getMessages, socket, currentRoom?.roomId]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* <ChatHeader /> */}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat chat-end`}
            ref={messageEndRef}
          >
            {console.log(message)}
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId._id === authUser._id
                      ? authUser.profilePic
                      : message.senderId.profilePic
                      ? message.senderId.profilePic
                      : authUser.profilePic
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(
                  message.createdAt ? message.createdAt : Date.now()
                )}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default RoomChatContainer;
