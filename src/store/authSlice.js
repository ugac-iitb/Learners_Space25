import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    refreshToken: null,
    username: null,
    user: null,
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
            state.refreshToken = action.payload.refreshToken || action.payload.refresh || null;
            state.loginTime = Date.now();
        },

        setAccount: (state, action) => {
            const payload = action.payload || {};
            state.user = payload.user || payload;
            state.username = payload.username || payload.full_name || payload.email || payload;
            state.isAuthenticated = true;
            
        },

        setCourses: (state, action) => {
            if (!action.payload) {
                state.courses = [];
                return;
            }

            state.courses = Array.isArray(action.payload) ? action.payload : [action.payload];
        },

        addCourse: (state, action) => {
            if (!state.courses.includes(action.payload)) {
                state.courses.push(action.payload);
            }
        },

        removeCourse: (state, action) => {
            state.courses = state.courses.filter((courseId) => courseId !== action.payload);
        },

        logout: (state) => {
            state.token = null;
            state.refreshToken = null;
            state.username = null;
            state.user = null;
            state.isAuthenticated = false;
            state.courses = [];
            state.loginTime = null;
        },
    },
});

export default authSlice;
