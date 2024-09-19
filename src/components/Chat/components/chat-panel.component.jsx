import React from "react";
import ChatBubble from "./chat-bubble.container";
import useScollRef from "../../../hooks/auto-scroll";

function ChatPanel({ messages }) {
  const scrollRef = useScollRef(messages);
  return (
    <div
      ref={scrollRef}
      style={{
        overflowY: "auto",
        maxHeight: "400px",
        justifyContent: "safe between",
      }}
      className="d-flex flex-column my-4  align-items-end"
    >
      {messages.map(({ role, message }, index) => (
        <ChatBubble
          key={`${role}-${message}-${index}`}
          message={message}
          role={role}
        />
      ))}
    </div>
  );
}

export default ChatPanel;
