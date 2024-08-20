// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const TOKEN_CHECK_INTERVAL = 60; // Check every minute

// const useTokenChecker = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkTokenValidity = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (token) {
//           const response = await axios.post(
//             "/user/validate-token",
//             { token },
//             { withCredentials: true }
//           );

//           if (!response.data.isValid) {
//             // Token is invalid or expired
//             localStorage.removeItem("token");
//             localStorage.removeItem("isLoggedIn");
//             localStorage.removeItem("isAdmin");
//             navigate("/loginSignup"); // Redirect to login page
//           }
//         } else {
//           navigate("/loginSignup"); // Redirect if no token is found
//         }
//       } catch (err) {
//         if (err.response && err.response.status === 401) {
//           // Token is invalid or expired
//           localStorage.removeItem("token");
//           localStorage.removeItem("isLoggedIn");
//           localStorage.removeItem("isAdmin");
//           navigate("/loginSignup"); // Redirect to login page
//         }
//       }
//     };

//     // Set interval to check token validity
//     const intervalId = setInterval(checkTokenValidity, TOKEN_CHECK_INTERVAL);

//     // Cleanup interval on component unmount
//     return () => clearInterval(intervalId);
//   }, [navigate]);
// };

// export default useTokenChecker;

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const TOKEN_CHECK_INTERVAL = 60000; // 1 minute

const useTokenChecker = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const response = await axios.post(
            "/user/validate-token",
            { token },
            { withCredentials: true }
          );

          if (!response.data.isValid) {
            // Token is invalid or expired
            localStorage.removeItem("token");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("isAdmin");

            // Prevent multiple navigations to the same route
            if (location.pathname !== "/loginSignup") {
              navigate("/loginSignup");
            }
          }
        } else if (location.pathname !== "/loginSignup") {
          navigate("/loginSignup"); // Redirect if no token is found
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem("token");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("isAdmin");

          if (location.pathname !== "/loginSignup") {
            navigate("/loginSignup");
          }
        }
      }
    };

    // Set interval to check token validity
    const intervalId = setInterval(checkTokenValidity, TOKEN_CHECK_INTERVAL);

    // Run the check immediately on mount
    checkTokenValidity();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [navigate, location]);
};

export default useTokenChecker;
