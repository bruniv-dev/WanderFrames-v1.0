// authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { sendAuthRequest } from "../components/api-helpers/helpers"; // Adjust import path if needed

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true" || false,
  isAdmin: localStorage.getItem("isAdmin") === "true" || false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.isAdmin = action.payload.isAdmin;
      state.token = action.payload.token; // Store token
    },
    logout(state) {
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.token = null; // Clear token
    },
    initializeAuth(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn ?? state.isLoggedIn;
      state.isAdmin = action.payload.isAdmin ?? state.isAdmin;
    },
  },
});

export const authActions = authSlice.actions;

export const initializeAuth = () => (dispatch) => {
  try {
    // Retrieve values from localStorage
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Convert string to boolean
    const isAdmin = localStorage.getItem("isAdmin") === "true"; // Convert string to boolean

    // If isLoggedIn is true, you can optionally validate the token with the backend
    // or perform other actions as needed

    // Update Redux state based on values from localStorage
    dispatch(
      authActions.initializeAuth({
        isLoggedIn,
        isAdmin,
      })
    );
  } catch (error) {
    console.error("Initialization failed:", error);
    dispatch(
      authActions.initializeAuth({
        isLoggedIn: false,
        isAdmin: false,
      })
    );
  }
};

// Thunk action to handle logout
export const logoutUser = () => async (dispatch) => {
  try {
    await axios.post("/user/logout", {}, { withCredentials: true });
    dispatch(authActions.logout());
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export default authSlice.reducer;
