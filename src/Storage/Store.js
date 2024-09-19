import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "./Slices/LoginSlice"; 
import chatSlice from "./Slices/chat-slice";

const Store = configureStore({
    reducer:{
        login:LoginSlice, 
        chat: chatSlice,
    }
})

export default Store