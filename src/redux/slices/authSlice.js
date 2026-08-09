import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("accessToken");

const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;

            localStorage.setItem(
                "user",
                JSON.stringify(action.payload)
            );
        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;

            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        },
    },
});

export const {
    loginSuccess,
    logout
} = authSlice.actions;

export default authSlice.reducer;