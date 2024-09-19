import React from "react";

function ChatBubble(props) {
  const { role, message } = props;
  console.log(role)
  return (
    <div
      style={{
        width: "50%",
        alignSelf: role !== "user" ? "end" : "start",
        justifySelf: "end",
        backgroundColor: `${
          role === "user" ? "var(--bs-blue)" : "var(--bs-gray-300)"
        }`,
        borderRadius:
          role !== "user" ? "10px 10px 0px 10px" : "10px 10px 10px 0px",
        padding: 10,
        color:role !== 'user' ? "var(--bs-gray-800)":"white",
      }}
      className="my-2"
    >
      {message}
    </div>
  );
}

export default ChatBubble;
