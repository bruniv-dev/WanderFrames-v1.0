import axios from "axios";

export const sendAuthRequest = async (signup, data) => {
  const endpoint = signup ? "/user/signup" : "/user/login"; // Adjust based on your API

  const payload = signup
    ? {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        securityQuestion: data.securityQuestion,
        securityAnswer: data.securityAnswer,
        isAdmin: data.isAdmin,
      }
    : {
        identifier: data.identifier,
        password: data.password,
      };

  try {
    const { status, data: responseData } = await axios.post(endpoint, payload, {
      withCredentials: true,
    });

    if (status === 200 || status === 201) {
      return responseData;
    }

    throw new Error(`Unexpected status code: ${status}`);
  } catch (error) {
    console.error(
      "Error during authentication:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const checkUsernameAvailability = async (
  username,
  includeCredentials = true
) => {
  try {
    const response = await axios.get(`/user/check-username/${username}`, {
      withCredentials: includeCredentials, // Control credentials based on the parameter
    });
    return response.data.isAvailable;
  } catch (error) {
    console.error("Error checking username availability:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await axios.post("/user/logout", {}, { withCredentials: true });
    console.log("logged out");
  } catch (error) {
    console.error("Logout failed:", error); // Handle any errors during logout
  }
};

export const getAllPosts = async () => {
  try {
    const res = await axios.get("/post");
    if (res.status !== 200) {
      console.log("Error Occurred");
    }
    const data = res.data;
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axios.get("/user");
    if (res.status !== 200) {
      console.log("Error Occurred");
    }
    const data = res.data;
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    throw error;
  }
};

export const fetchUserDetailsById = async (userId) => {
  try {
    // Ensure cookies are sent with the request
    const response = await axios.get(`/user/${userId}`, {
      withCredentials: true, // This ensures that cookies, including HTTP-only cookies, are sent with the request
    });

    return response.data; // Return the entire user object
  } catch (err) {
    console.error("Error fetching user details:", err);
    throw err;
  }
};

export const fetchUserDetailsByToken = async () => {
  try {
    const response = await axios.get("/user/by-token/me", {
      withCredentials: true, // Ensure cookies are included
    });

    return response.data; // Return the entire user object
  } catch (err) {
    if (err.response && err.response.status === 401) {
      // Token is invalid or expired
      console.error("Token expired or invalid");
      // Optionally, redirect to login page or clear user session
    }
    throw err;
  }
};

export const fetchPostById = async (postId) => {
  const res = await axios
    .get(`/post/${postId}`, { withCredentials: true })
    .catch((err) => {
      console.log(err);
    });
  if (res.status !== 200) {
    return console.log("Error fetching post data");
  }
  const resData = await res.data;
  return resData;
};

export const addPost = async (data) => {
  try {
    const response = await axios.post("/post/addPost", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    // Check if response status is 201 (Created)
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error occurred while adding post:", error);
    throw new Error("Failed to add post. Please try again later.");
  }
};

export const fetchUserProfile = async (userId) => {
  try {
    const response = await axios.get(`/user/profile/${userId}`, {
      withCredentials: true,
    });
    return response.data; // Ensure this matches the API response
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const fetchUserPosts = async (userId) => {
  try {
    const response = await axios.get(`/user/posts/${userId}`, {
      withCredentials: true,
    });
    return response.data.posts;
  } catch (err) {
    console.error("Error fetching user posts:", err);
    throw err;
  }
};

export const updatePost = async (id, data) => {
  try {
    const response = await axios.put(
      `/post/${id}`,
      {
        location: data.location,
        subLocation: data.subLocation,
        description: data.description,
        locationUrl: data.locationUrl || "",
      },
      {
        withCredentials: true, // Ensure cookies are sent with the request
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to update the post");
    }

    const resData = await response.data;
    return resData;
  } catch (error) {
    console.error("Error updating post:", error.message);
    throw error;
  }
};

export const updateUserProfile = async (userId, formData) => {
  try {
    const response = await axios.put(`/user/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error.response
      ? error.response.data
      : new Error("Error updating user profile");
  }
};

export const deletePostById = async (id) => {
  try {
    const response = await axios.delete(`/post/${id}`, {
      withCredentials: true,
    });
    return response.data; // Ensure this matches the API response structure
  } catch (error) {
    console.error("Error deleting post by ID:", error);
    throw error;
  }
};
//actions -- admin
export const deleteUserById = async (id) => {
  try {
    const response = await axios.delete(`/user/${id}`, {
      withCredentials: true,
    });
    return response.data; // Ensure this matches the API response structure
  } catch (error) {
    console.error("Error deleting post by ID:", error);
    throw error;
  }
};

// // API call to delete user account
// export const deleteUserAccount = async (userId) => {
//   try {
//     const response = await axios.delete(`/user/${userId}`, {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting user account:", error.message);
//     throw error;
//   }
// };

export const updateUserIsAdmin = async (userId, isAdmin) => {
  try {
    const response = await axios.put(
      `/user/${userId}/isAdmin`,
      {
        isAdmin,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

export const resetPassword = async (userId, oldPassword, newPassword) => {
  const response = await axios.post(
    `/user/reset-password/${userId}`,
    {
      oldPassword,
      newPassword,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

//forgotpassword
export const sendResetPasswordRequest = async (identifier) => {
  try {
    const response = await axios.post("/user/requestReset", { identifier });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error(
        "Error requesting password reset:",
        error.response.data.message
      );
      throw new Error(error.response.data.message); // Throw custom error message for 404
    }
    console.error("Error requesting password reset:", error);
    throw new Error("Failed to request password reset"); // General error message for other errors
  }
};

export const verifySecurityAnswer = async (identifier, securityAnswer) => {
  const response = await axios.post("/user/verifySecurityAnswer", {
    identifier,
    securityAnswer,
  });
  return response.data;
};

export const forgotPasswordReset = async (userId, newPassword) => {
  const response = await axios.post(`/user/forgot-password-reset/${userId}`, {
    newPassword,
  });
  return response.data;
};

export const toggleFavorite = async (postId, userId) => {
  if (!userId || !postId) {
    throw new Error("User ID or Post ID is missing");
  }

  try {
    const res = await axios.post(
      "/user/toggleFavorite",
      {
        userId,
        postId,
      },
      {
        withCredentials: true,
      }
    );
    return res.data; // Data should include the updated favorites list
  } catch (error) {
    console.error("Error toggling favorite:", error.message);
    throw error;
  }
};

// Fetch favorites for the logged-in user
export const fetchFavorites = async (userId) => {
  if (!userId) {
    throw new Error("User ID is missing");
  }

  try {
    const response = await axios.get(`/user/favorites/${userId}`, {
      withCredentials: true,
    });
    return response.data; // Data should include the favorites list
  } catch (err) {
    console.error("Error fetching favorites:", err);
    throw err;
  }
};

export const checkAuth = async () => {
  try {
    // Make a GET request to the /user/check-auth endpoint
    const response = await axios.get("/user/check-auth", {
      withCredentials: true, // Ensure cookies are sent with the request
    });

    // If the response status is 200, consider the user as authenticated
    if (response.status === 200) {
      return { success: true, user: response.data.user }; // Return user data if needed
    } else {
      return { success: false }; // Not authenticated
    }
  } catch (error) {
    console.error("Error checking authentication:", error.message);
    return { success: false }; // If an error occurs, assume not authenticated
  }
};
