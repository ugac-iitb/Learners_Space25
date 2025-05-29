import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    username: null,
    isAuthenticated: false,
    courses: [],
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        setAuthTokens: (state, action) => {
            state.token = action.payload.token;
        },

        setAccount: (state, action) => {
            state.username = action.payload;
            state.isAuthenticated = true;
        },

        setCourses: (state, action) => {
            if (!Array.isArray(state.courses)) {
                state.courses.push(action.payload);
            }

            state.courses.push(...action.payload);
        },

        logout: (state) => {
            state.token = null;
            state.username = null;
            state.isAuthenticated = false;
            state.courses = [];
        },
    },
});

export default authSlice;
