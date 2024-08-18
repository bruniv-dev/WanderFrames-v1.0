// // // import { createSlice } from "@reduxjs/toolkit";
// // // import axios from "axios";
// // // import { sendAuthRequest } from "../components/api-helpers/helpers"; // Adjust import path if needed

// // // const authSlice = createSlice({
// // //   name: "auth",
// // //   initialState: { isLoggedIn: false, isAdmin: false },
// // //   reducers: {
// // //     login(state, action) {
// // //       state.isLoggedIn = true;
// // //       state.isAdmin = action.payload.isAdmin;
// // //     },
// // //     logout(state) {
// // //       state.isLoggedIn = false;
// // //       state.isAdmin = false;
// // //     },
// // //     initializeAuth(state, action) {
// // //       state.isLoggedIn = action.payload.isLoggedIn ?? state.isLoggedIn;
// // //       state.isAdmin = action.payload.isAdmin ?? state.isAdmin;
// // //     },
// // //   },
// // // });

// // // export const authActions = authSlice.actions;

// // // export const initializeAuth = () => async (dispatch) => {
// // //   try {
// // //     const responseData = await sendAuthRequest(false); // Ensure this returns expected data

// // //     if (responseData && responseData.success) {
// // //       dispatch(
// // //         authActions.initializeAuth({
// // //           isLoggedIn: responseData.isLoggedIn || false,
// // //           isAdmin: responseData.isAdmin || false,
// // //         })
// // //       );
// // //     } else {
// // //       dispatch(
// // //         authActions.initializeAuth({
// // //           isLoggedIn: false,
// // //           isAdmin: false,
// // //         })
// // //       );
// // //     }
// // //   } catch (error) {
// // //     console.error("Initialization failed:", error);
// // //     dispatch(
// // //       authActions.initializeAuth({
// // //         isLoggedIn: false,
// // //         isAdmin: false,
// // //       })
// // //     );
// // //   }
// // // };

// // // // Thunk action to handle login
// // // export const loginUser = (credentials) => async (dispatch) => {
// // //   try {
// // //     const responseData = await sendAuthRequest(false, credentials); // `false` indicates login

// // //     if (responseData.success) {
// // //       dispatch(authActions.login({ isAdmin: responseData.isAdmin }));
// // //     }
// // //   } catch (error) {
// // //     console.error("Login failed:", error);
// // //   }
// // // };

// // // // Thunk action to handle signup
// // // export const signupUser = (userData) => async (dispatch) => {
// // //   try {
// // //     const responseData = await sendAuthRequest(true, userData); // `true` indicates signup

// // //     if (responseData.success) {
// // //       dispatch(authActions.login({ isAdmin: responseData.isAdmin }));
// // //     }
// // //   } catch (error) {
// // //     console.error("Signup failed:", error);
// // //   }
// // // };

// // // // Thunk action to handle logout
// // // export const logoutUser = () => async (dispatch) => {
// // //   try {
// // //     await axios.post("/user/logout", {}, { withCredentials: true });
// // //     dispatch(authActions.logout());
// // //   } catch (error) {
// // //     console.error("Logout failed:", error);
// // //   }
// // // };

// // // export default authSlice.reducer;

// // // src/store/authSlice.js
// // // import { createSlice } from "@reduxjs/toolkit";
// // // import axios from "axios";
// // // import { sendAuthRequest } from "../components/api-helpers/helpers"; // Adjust import path if needed

// // // const authSlice = createSlice({
// // //   name: "auth",
// // //   initialState: { isLoggedIn: false, isAdmin: false },
// // //   reducers: {
// // //     login(state, action) {
// // //       state.isLoggedIn = true;
// // //       state.isAdmin = action.payload.isAdmin;
// // //     },
// // //     logout(state) {
// // //       state.isLoggedIn = false;
// // //       state.isAdmin = false;
// // //     },
// // //     initializeAuth(state, action) {
// // //       // Safely access payload properties with default values
// // //       state.isLoggedIn = action.payload.isLoggedIn ?? state.isLoggedIn;
// // //       state.isAdmin = action.payload.isAdmin ?? state.isAdmin;
// // //     },
// // //   },
// // // });

// // // export const authActions = authSlice.actions;

// // // export const initializeAuth = () => async (dispatch) => {
// // //   try {
// // //     const responseData = await sendAuthRequest(false); // Ensure this returns expected data

// // //     if (responseData && responseData.success) {
// // //       dispatch(
// // //         authActions.initializeAuth({
// // //           isLoggedIn: responseData.isLoggedIn ?? false,
// // //           isAdmin: responseData.isAdmin ?? false,
// // //         })
// // //       );
// // //     } else {
// // //       dispatch(
// // //         authActions.initializeAuth({
// // //           isLoggedIn: false,
// // //           isAdmin: false,
// // //         })
// // //       );
// // //     }
// // //   } catch (error) {
// // //     console.error("Initialization failed:", error);
// // //     dispatch(
// // //       authActions.initializeAuth({
// // //         isLoggedIn: false,
// // //         isAdmin: false,
// // //       })
// // //     );
// // //   }
// // // };

// // // // Thunk action to handle login
// // // export const loginUser = (credentials) => async (dispatch) => {
// // //   try {
// // //     const responseData = await sendAuthRequest(false, credentials); // `false` indicates login

// // //     if (responseData.success) {
// // //       dispatch(authActions.login({ isAdmin: responseData.isAdmin }));
// // //     }
// // //   } catch (error) {
// // //     console.error("Login failed:", error);
// // //   }
// // // };

// // // // Thunk action to handle signup
// // // export const signupUser = (userData) => async (dispatch) => {
// // //   try {
// // //     const responseData = await sendAuthRequest(true, userData); // `true` indicates signup

// // //     if (responseData.success) {
// // //       dispatch(authActions.login({ isAdmin: responseData.isAdmin }));
// // //     }
// // //   } catch (error) {
// // //     console.error("Signup failed:", error);
// // //   }
// // // };

// // // // Thunk action to handle logout
// // // export const logoutUser = () => async (dispatch) => {
// // //   try {
// // //     await axios.post("/user/logout", {}, { withCredentials: true });
// // //     dispatch(authActions.logout());
// // //   } catch (error) {
// // //     console.error("Logout failed:", error);
// // //   }
// // // };

// // // export default authSlice.reducer;

// authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { sendAuthRequest } from "../components/api-helpers/helpers"; // Adjust import path if needed

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false, isAdmin: false },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.isAdmin = action.payload.isAdmin;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.isAdmin = false;
    },
    initializeAuth(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn ?? state.isLoggedIn;
      state.isAdmin = action.payload.isAdmin ?? state.isAdmin;
    },
  },
});

export const authActions = authSlice.actions;

export const initializeAuth = () => async (dispatch) => {
  try {
    const responseData = await sendAuthRequest(false); // Ensure this returns expected data

    if (responseData && responseData.success) {
      dispatch(
        authActions.initializeAuth({
          isLoggedIn: responseData.isLoggedIn || false,
          isAdmin: responseData.isAdmin || false,
        })
      );
    } else {
      dispatch(
        authActions.initializeAuth({
          isLoggedIn: false,
          isAdmin: false,
        })
      );
    }
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

// Thunk action to handle login
export const loginUser = (credentials) => async (dispatch) => {
  try {
    const responseData = await sendAuthRequest(false, credentials); // `false` indicates login

    if (responseData.success) {
      dispatch(authActions.login({ isAdmin: responseData.isAdmin }));
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
};

// Thunk action to handle signup
export const signupUser = (userData) => async (dispatch) => {
  try {
    const responseData = await sendAuthRequest(true, userData); // `true` indicates signup

    if (responseData.success) {
      dispatch(authActions.login({ isAdmin: responseData.isAdmin }));
    }
  } catch (error) {
    console.error("Signup failed:", error);
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
