import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { LuRefreshCcw } from "react-icons/lu";
import Cookies from "js-cookie";
import { CiLight } from "react-icons/ci";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ChatView = () => {
  const query = useQuery();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [userId, setUserId] = useState(Cookies.get("usrin")); // Set your user_id
  const [personId, setPersonId] = useState(query?.get("person_id")); // Will be set based on selected conversation
  const [userList, setUserList] = useState([]);
  const chatWindowRef = useRef(null); // To reference the chat window

  const getUserList = async () => {
    try {
      const response = await axios.post(
        "https://truck.truckmessage.com/get_user_chat_list",
        {
          user_id: window.atob(userId),
        }
      );

      if (response.data.error_code === 0) {

        const filterUser = response.data.data.filter((v) => {
          return v.person_id != window.atob(userId)
        })

        const sortByData = filterUser.sort(function (a, b) {
          return new Date(b.last_time) - new Date(a.last_time);
        })

        const findUser = response.data.data.filter((findUSer) => {
          return findUSer.person_id == personId;
        });

        if (findUser.length === 0) {
          if (personId) {
            const getUserProfileResponse = await axios.post('https://truck.truckmessage.com/get_user_profile', {
              user_id: personId
            })

            if (getUserProfileResponse.data.data.length > 0) {
              const userProfileNotInList = {
                last_msg: '',
                last_time: '',
                person_id: parseInt(getUserProfileResponse.data.data[1].user_id),
                profile_image_name: getUserProfileResponse.data.data[1].profile_image_name,
                profile_name: getUserProfileResponse.data.data[1].name
              }

              const addUserInList = [userProfileNotInList, ...sortByData]
              setUserList(addUserInList);
            }
            setPersonId(personId);
            fetchChatMessages(personId);
          } else {
            setUserList(sortByData);
          }
        } else {
          setUserList(sortByData);
          setPersonId(personId);
          fetchChatMessages(personId);
        }
      }
    } catch (err) {
      console.error("Error getting user list:", err);
    }
  };

  const fetchChatMessages = async (personIdProps) => {
    try {
      const response = await axios.post(
        "https://truck.truckmessage.com/get_user_chat_message_list",
        {
          user_id: window.atob(userId),
          person_id: personIdProps,
        }
      );

      if (response.data.error_code === 0) {
        // Reverse the messages to display the most recent at the bottom
        setMessages(response.data.data.reverse());
      } else {
        console.error("Error fetching messages:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await axios.post(
          "https://truck.truckmessage.com/user_chat_message",
          {
            user_id: window.atob(userId),
            person_id: personId,
            message: newMessage,
          }
        );

        if (response.data.error_code === 0) {
          // Add sent message to the message list
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              chat_id: window.atob(userId),
              message: newMessage,
              updt: new Date().toUTCString(),
            },
          ]);
          setNewMessage("");
        } else {
          console.error("Error sending message:", response.data.message);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Function to handle selecting a conversation
  const handleSelectConversation = (conversation, personId) => {
    setSelectedConversation(conversation);
    setPersonId(personId);
    fetchChatMessages(personId);
  };

  // const handleRefresh = () => {
  //   getUserList(); // Refresh the contact list
  // };

  useEffect(() => {
    getUserList();
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat window when messages are updated
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="container-fluid d-flex flex-column py-3">
      <div className="row flex-grow-1">
        {/* Conversation List */}
        <div className="col-md-4 border-end border-top conversation-list">
          <h5 className="card-title chatlisthead mt-3">Chat List</h5>
          <div className="list-group pt-3">
            {userList.map((users, userIndex) => {
              return (
                <button
                  key={userIndex}
                  className={`chat-person-card mb-2 d-flex align-items-center ${users.person_id == personId ? "active" : ""
                    }`}
                  onClick={() => {
                    handleSelectConversation("Conversation 1", users.person_id);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={users.profile_image_name}
                    width="40"
                    height="40"
                    className="rounded-circle img1"
                    alt="User"
                  />
                  <div className="ms-3 test-start">
                    <div className="fw-bold text-start">
                      {users.profile_name}
                    </div>
                    <div className="text-muted">
                      {users.last_msg}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        <div className="col-md-8 border-top d-flex flex-column">
          <div className="col-md-12 row d-flex align-items-center gap-2">
            <h5 className="col-md-12 card-title chatlistheadcon mt-3 pe-2">
              Conversations
            </h5>
            {/* <button
              className="ps-2 p-4 btn col-md-2 btn-outline-secondary"
              onClick={handleRefresh}
            >
              <LuRefreshCcw />
            </button> */}
          </div>
          <div
            className="flex-grow-1 p-3 chat-window d-flex flex-column chat-messgae-min-height"
            ref={chatWindowRef}
          >
            {messages.map((msg, index) => {
              return (
                <div
                  key={index}
                  className={`message col-12 row flex-row mb-3 ${msg.chat_id == window.atob(userId)
                    ? "text-end"
                    : "text-start"
                    }`}
                >
                  {msg.chat_id != window.atob(userId) ? (
                    <div className="col-1 text-center">
                      <img
                        src="https://img.icons8.com/color/40/000000/guest-female.png"
                        height="40"
                        className="rounded-circle "
                        alt="User"
                      />
                    </div>
                  ) : null}

                  <div className="col-11">
                    <div
                      className={`message-content col-6 p-2 rounded ${msg.chat_id == window.atob(userId)
                        ? "bg-primary text-white text-start"
                        : "bg-light text-dark"
                        }`}
                    >
                      <div>{msg.message}</div>
                      <div className="small">
                        {new Date(msg.updt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {msg.chat_id == window.atob(userId) ? (
                    <div className="col-1 text-center">
                      <img
                        src="https://img.icons8.com/color/40/000000/guest-female.png"
                        height="40"
                        className="rounded-circle img1"
                        alt="User"
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="p-3 border-top">
            <div className="input-group position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />

              <div className="send-message-btn">
                <button className="btn btn-primary" onClick={handleSendMessage}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
