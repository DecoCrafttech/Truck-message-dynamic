import { createSlice } from "@reduxjs/toolkit";

const initialState={
    userDetails:{},
    isLoggedIn:false
}

const LoginSlice = createSlice({
    name:"Login slice",
    initialState,
    