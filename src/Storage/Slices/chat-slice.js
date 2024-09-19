import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const ChatSlice = createSlice({
  name: "chat-slice",
  initialState,
  reducers: {
    updateUserMessage: (state, action) => {
      const newMessage = action.payload;
      const messageExists = state.some(
        (message) => message.id === newMessage.id
      );

      // if (!messageExists) {
        state.push(newMessage);
      // }
    },
    updateCurrentUserMessage: (state, action) => {
      const newMessage = action.payload;
      const messageExists = state.some(
        (message) => message.id === newMessage.id
      );

      // if (!messageExists) {
        state.push(newMessage);
      // }
    },
  },
});

export const { updateUserMessage, updateCurrentUserMessage } =
  ChatSlice.actions;

export default ChatSlice.reducer;
