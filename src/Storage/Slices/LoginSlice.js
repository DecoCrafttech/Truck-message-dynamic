import { createSlice } from "@reduxjs/toolkit";

const initialState={
    userDetails:{},
    chatUserDetails:{},
    isLoggedIn:false
}

const LoginSlice = createSlice({
    name:"Login slice",
    initialState,
    reducers:{
        updateIsLoggedIn:(state,action)=>{
            state.isLoggedIn=action.payload
        },
        updateUserDetails:(state,action)=>{
            state.userDetails=action.payload
        },
        updateChatUserDetails:(state,action)=>{
            state.chatUserDetails=action.payload
        }
    }
})

export const {updateIsLoggedIn,updateUserDetails,updateChatUserDetails} = LoginSlice.actions;

export default LoginSlice.reducer;