import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    username: null,
    isAuthenticated: false,
    courses: [],
    loginTime: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        setAuthTokens: (state, action) => {
            state.token = action.payload.token;
            state.loginTime = Date.now();
        },

        setAccount: (state, action) => {
            state.username = action.payload;
            state.isAuthenticated = true;
            
        },

        setCourses: (state, action) => {
            if (!Array.isArray(action.payload)) {
                state.courses.push(action.payload);
            }
            else{
                state.courses.push(...action.payload);
            }
            
        },

        logout: (state) => {
            state.token = null;
            state.username = null;
            state.isAuthenticated = false;
            state.courses = [];
            state.loginTime = null;
        },
    },
});

export default authSlice;
