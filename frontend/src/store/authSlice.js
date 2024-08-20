// // authSlice.js
// import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState = {
//   isLoggedIn: localStorage.getItem("isLoggedIn") === "true" || false,
//   isAdmin: localStorage.getItem("isAdmin") === "true" || false,
// };
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     login(state, action) {
//       state.isLoggedIn = true;
//       state.isAdmin = action.payload.isAdmin;
//       state.token = action.payload.token; // Store token
//     },
//     logout(state) {
//       state.isLoggedIn = false;
//       state.isAdmin = false;
//       state.token = null; // Clear token
//     },
//     initializeAuth(state, action) {
//       state.isLoggedIn = action.payload.isLoggedIn ?? state.isLoggedIn;
//       state.isAdmin = action.payload.isAdmin ?? state.isAdmin;
//     },
//   },
// });

// export const authActions = authSlice.actions;

// export const initializeAuth = () => (dispatch) => {
//   try {
//     // Retrieve values from localStorage
//     const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Convert string to boolean
//     const isAdmin = localStorage.getItem("isAdmin") === "true"; // Convert string to boolean

//     // If isLoggedIn is true, you can optionally validate the token with the backend
//     // or perform other actions as needed

//     // Update Redux state based on values from localStorage
//     dispatch(
//       authActions.initializeAuth({
//         isLoggedIn,
//         isAdmin,
//       })
//     );
//   } catch (error) {
//     console.error("Initialization failed:", error);
//     dispatch(
//       authActions.initializeAuth({
//         isLoggedIn: false,
//         isAdmin: false,
//       })
//     );
//   }
// };

// // Thunk action to handle logout
// export const logoutUser = () => async (dispatch) => {
//   try {
//     await axios.post("/user/logout", {}, { withCredentials: true });
//     dispatch(authActions.logout());
//   } catch (error) {
//     console.error("Logout failed:", error);
//   }
// };

// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true" || false,
  isAdmin: localStorage.getItem("isAdmin") === "true" || false,
  token: localStorage.getItem("token") || null, // Store token
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.isAdmin = action.payload.isAdmin;
      state.token = action.payload.token; // Store token
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("isAdmin", action.payload.isAdmin.toString());
      localStorage.setItem("token", action.payload.token); // Store token in localStorage
    },
    logout(state) {
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.token = null; // Clear token
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("token"); // Remove token from localStorage
    },
    initializeAuth(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn ?? state.isLoggedIn;
      state.isAdmin = action.payload.isAdmin ?? state.isAdmin;
      state.token = action.payload.token ?? state.token;
    },
  },
});

export const authActions = authSlice.actions;

export const initializeAuth = () => async (dispatch) => {
  try {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const token = localStorage.getItem("token");

    if (isLoggedIn && token) {
      // Validate token with backend
      const response = await axios.post(
        "/user/validate-token",
        { token },
        { withCredentials: true }
      );

      if (response.data.isValid) {
        dispatch(
          authActions.initializeAuth({
            isLoggedIn,
            isAdmin,
            token,
          })
        );
      } else {
        // Token is invalid or expired
        dispatch(authActions.logout());
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("isAdmin");
      }
    } else {
      dispatch(
        authActions.initializeAuth({
          isLoggedIn: false,
          isAdmin: false,
          token: null,
        })
      );
    }
  } catch (error) {
    console.error("Initialization failed:", error);
    dispatch(
      authActions.initializeAuth({
        isLoggedIn: false,
        isAdmin: false,
        token: null,
      })
    );
  }
};

// export const initializeAuth = () => async (dispatch) => {
//   try {
//     const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//     const isAdmin = localStorage.getItem("isAdmin") === "true";
//     const token = localStorage.getItem("token");

//     // Optionally validate the token with the backend
//     if (isLoggedIn && token) {
//       const response = await axios.post(
//         "/user/validate-token",
//         { token },
//         { withCredentials: true }
//       );
//       if (response.data.isValid) {
//         dispatch(
//           authActions.initializeAuth({
//             isLoggedIn,
//             isAdmin,
//             token,
//           })
//         );
//       } else {
//         dispatch(authActions.logout()); // Token is invalid, perform logout
//       }
//     } else {
//       dispatch(
//         authActions.initializeAuth({
//           isLoggedIn: false,
//           isAdmin: false,
//           token: null,
//         })
//       );
//     }
//   } catch (error) {
//     console.error("Initialization failed:", error);
//     dispatch(
//       authActions.initializeAuth({
//         isLoggedIn: false,
//         isAdmin: false,
//         token: null,
//       })
//     );
//   }
// };

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
