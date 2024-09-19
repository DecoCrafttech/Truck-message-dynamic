import { useDispatch } from "react-redux";
import ChatInput from "./chat-input.componnet";
import { updateCurrentUserMessage } from "../../../Storage/Slices/chat-slice";
import { useRef } from "react";
import { getSocket } from "../../../socket";
import Cookies from 'js-cookie'

function ChatFooter({chatId, receipt}) {
  const userDetails = Cookies.get('usrin') ? window.atob(Cookies.get('usrin')) : '';

  const inputRef = useRef();
  const dispatch = useDispatch();
  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.clear();
    }
  };
  const handleSendMessage = () => {
    const socket = getSocket();

    if(socket){
      console.log(socket,{
        user_id: userDetails,
        person_id : receipt?.id,
        room_id: chatId ,
        message: inputRef.current.value
      })
      socket.emit('send_message',{
        user_id: userDetails,
        person_id : receipt?.id,
        room_id: chatId ,
        message: inputRef.current.value
      })
    }
    
    dispatch(
      updateCurrentUserMessage({
        role: "currentUser",
        message: inputRef.current.value,
      })
    );
    clearInput();
  };
  const handleOnEnterKey = () => {
    handleSendMessage();
  };

  return (
    <div className="row">
      <div className="col-10">
        <ChatInput ref={inputRef} onEnterKey={handleOnEnterKey} />
      </div>
      <div className="col-2">
        <button
          onClick={handleSendMessage}
          style={{
            backgroundColor: "red",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatFooter;
