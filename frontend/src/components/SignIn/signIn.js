import React, { useState, useEffect } from "react";
import "./SignIn.css";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import {
  sendAuthRequest,
  checkUsernameAvailability,
} from "../api-helpers/helpers";
import Loading from "../Loading/Loading";

const SignInSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    securityQuestion: "",
    securityAnswer: "",
    identifier: "",
  });
  const [usernameStatus, setUsernameStatus] = useState("");
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    securityQuestion: "",
    securityAnswer: "",
    identifier: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setInputs({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      securityQuestion: "",
      securityAnswer: "",
      identifier: "",
    });
    setErrors({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      securityQuestion: "",
      securityAnswer: "",
      identifier: "",
    });
    setUsernameStatus("");
    setSubmitted(false);
  }, [isSignUp]);

  useEffect(() => {
    const checkAvailability = async () => {
      const usernameRegex = /^[a-zA-Z0-9._]{6,}$/;

      if (isSignUp && inputs.username) {
        if (!usernameRegex.test(inputs.username)) {
          setUsernameStatus(
            "Username can only contain letters, numbers, underscores (_), and periods (.) and be over 6 characters"
          );
          return;
        }

        try {
          setLoading(true);
          const isAvailable = await checkUsernameAvailability(inputs.username);
          setUsernameStatus(
            isAvailable
              ? "Username is available."
              : "Username is already taken."
          );
        } catch (err) {
          setUsernameStatus("Error checking username availability.");
        } finally {
          setLoading(false);
        }
      } else {
        setUsernameStatus("");
      }
    };

    const debounce = setTimeout(checkAvailability, 300);
    return () => clearTimeout(debounce);
  }, [inputs.username, isSignUp]);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const validateInputs = () => {
    const newErrors = {};

    if (isSignUp) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (inputs.password && !passwordRegex.test(inputs.password)) {
        newErrors.password =
          "Password must include an uppercase letter, lowercase letter, digit, special character, and be over 8 characters.";
      } else {
        delete newErrors.password;
      }

      if (inputs.email && !emailRegex.test(inputs.email)) {
        newErrors.email = "Please enter a valid email address.";
      } else {
        delete newErrors.email;
      }

      if (submitted && !inputs.securityQuestion) {
        newErrors.securityQuestion = "Please select a security question.";
      } else {
        delete newErrors.securityQuestion;
      }

      if (submitted && !inputs.securityAnswer) {
        newErrors.securityAnswer = "Required";
      } else {
        delete newErrors.securityAnswer;
      }
    } else {
      if (submitted && !inputs.identifier) {
        newErrors.identifier = "Please enter your username or email.";
      } else {
        delete newErrors.identifier;
      }

      if (submitted && !inputs.password) {
        newErrors.password = "Please enter your password.";
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      const data = await sendAuthRequest(isSignUp, inputs);

      // if (isSignUp) {
      //   console.log("Sign-up successful:", data);
      //   toggleForm();
      // } else {
      //   const { userId, isAdmin } = data || {};

      //   if (userId) {
      //     dispatch(authActions.login({ userId, isAdmin }));
      //   } else {
      //     throw new Error("Failed to retrieve user information.");
      //   }

      //   navigate("/");
      // }
      if (isSignUp) {
        console.log("Sign-up successful:", data);
        toggleForm();
      } else {
        const { userId, isAdmin, token, isLoggedIn } = data || {};

        if (userId && isLoggedIn) {
          // Store token and isLoggedIn in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("isAdmin", isAdmin);
          localStorage.setItem("isLoggedIn", isLoggedIn.toString()); // Convert to string

          // Update Redux state
          dispatch(authActions.login({ userId, isAdmin, token }));

          // Redirect to home or dashboard
          navigate("/");
        } else {
          throw new Error("Failed to retrieve user information.");
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setErrors((prevErrors) => ({
        ...prevErrors,
        form:
          err.response?.data?.message || "An error occurred. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    validateInputs();
  };

  const handleVideoLoad = () => {
    setLoading(false);
  };

  return (
    <div className="loginSignup-container">
      {loading && <Loading />}
      <h2 className="signup-logo" onClick={() => navigate("/")}>
        BRUNIV
      </h2>
      <video
        autoPlay
        muted
        loop
        className="loginSignup-background-video"
        preload="auto"
        onLoadedData={handleVideoLoad}
      >
        <source src="beach3.mp4" type="video/mp4" />
      </video>
      <div className="loginSignup-form-container">
        <div className={`loginSignup-overlay ${isSignUp ? "signup" : "login"}`}>
          <video autoPlay muted loop onLoadedData={handleVideoLoad}>
            <source src="road.mp4" type="video/mp4" preload="auto" />
          </video>
          <div className="loginSignup-overlay-content">
            {!isSignUp ? (
              <>
                <h2 className="overlay-line-1">Hello There!</h2>
                <h3 className="overlay-line-2">
                  Start your journey with us by creating an account
                </h3>
                <button onClick={() => setIsSignUp(true)} className="login">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <h2 className="overlay-line-1">Welcome Back!</h2>
                <h3 className="overlay-line-2">
                  To stay connected, please log in to your account.
                </h3>
                <button onClick={() => setIsSignUp(false)} className="signup">
                  Log In
                </button>
              </>
            )}
          </div>
        </div>
        <div className="loginSignup-forms">
          <div className="loginSignup-login-form">
            <h2>Log In</h2>
            {errors.form && (
              <p className="loginSignup-error-message login">{errors.form}</p>
            )}
            <div className="loginSignup-form-group">
              <label htmlFor="identifier">Username or Email:</label>
              <input
                name="identifier"
                value={inputs.identifier || ""}
                onChange={handleChange}
                type="text"
                id="identifier"
                required
              />
              {errors.identifier && (
                <p className="loginSignup-error-message login">
                  {errors.identifier}
                </p>
              )}
            </div>
            <div className="loginSignup-form-group">
              <label htmlFor="password">Password:</label>
              <div className="loginSignup-password-container">
                <input
                  name="password"
                  value={inputs.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="loginSignup-password"
                  required
                />
                <span
                  className="loginSignup-toggle-password"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              {errors.password && (
                <p className="loginSignup-error-message login">
                  {errors.password}
                </p>
              )}
              <a href="/forgot-password" className="forgot-password">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="loginSignup-auth-btn login"
              disabled={loading}
              onClick={handleSubmit}
            >
              Log In
            </button>
          </div>

          <div className="loginSignup-signup-form">
            <h2>Sign Up</h2>
            {errors.form && (
              <p className="loginSignup-error-message signup-top">
                {errors.form}
              </p>
            )}
            <div className="loginSignup-form-group">
              <div className="loginSignup-first-last">
                <div>
                  <label htmlFor="firstName">First Name:</label>
                  <input
                    name="firstName"
                    value={inputs.firstName}
                    onChange={handleChange}
                    type="text"
                    id="firstName"
                    className="loginSignup-firstName"
                    required
                  />
                  {errors.firstName && (
                    <p className="loginSignup-error-message">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName">Last Name:</label>
                  <input
                    name="lastName"
                    value={inputs.lastName}
                    onChange={handleChange}
                    type="text"
                    id="lastName"
                    className="loginSignup-lastName"
                    required
                  />
                  {errors.lastName && (
                    <p className="loginSignup-error-message">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="loginSignup-form-group">
              <label htmlFor="username">Username:</label>
              <input
                name="username"
                value={inputs.username}
                onChange={handleChange}
                type="text"
                id="username"
                required
                className="loginSignup-userName"
              />
              <p
                className={`loginSignup-username-status ${
                  usernameStatus.includes("available")
                    ? "available"
                    : "unavailable"
                }`}
              >
                {usernameStatus}
              </p>
              {errors.username && (
                <p className="loginSignup-error-message">{errors.username}</p>
              )}
            </div>
            <div className="loginSignup-form-group">
              <label htmlFor="email">Email:</label>
              <input
                name="email"
                value={inputs.email}
                onChange={handleChange}
                type="email"
                id="email"
                className="loginSignup-email"
                required
              />
              {errors.email && (
                <p className="loginSignup-error-message">{errors.email}</p>
              )}
            </div>
            <div className="loginSignup-form-group">
              <label htmlFor="password">Password:</label>
              <div className="loginSignup-password-container">
                <input
                  name="password"
                  value={inputs.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="loginSignup-password"
                  required
                />
                <span
                  className="loginSignup-toggle-password"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              {errors.password && (
                <p className="loginSignup-error-message">{errors.password}</p>
              )}
            </div>
            <div className="loginSignup-security-first-last">
              <div className="loginSignup-form-group">
                <label htmlFor="securityQuestion">Security Question:</label>
                <select
                  name="securityQuestion"
                  onChange={handleChange}
                  value={inputs.securityQuestion}
                  id="securityQuestion"
                  className="loginSignup-securityQuestion"
                  required
                >
                  <option value="">Select a question</option>
                  <option value="What is your pet's name?">
                    What is your pet's name?
                  </option>
                  <option value="What is your mother's maiden name?">
                    What is your mother's maiden name?
                  </option>
                  <option value="What was the name of your first school?">
                    What was the name of your first school?
                  </option>
                  <option value="What is your favorite book?">
                    What is your favorite book?
                  </option>
                </select>
                {errors.securityQuestion && (
                  <p className="loginSignup-error-message">
                    {errors.securityQuestion}
                  </p>
                )}
              </div>
              <div className="loginSignup-form-group">
                <label htmlFor="securityAnswer">Security Answer:</label>
                <input
                  name="securityAnswer"
                  onChange={handleChange}
                  type="text"
                  id="securityAnswer"
                  className="loginSignup-securityAnswer"
                  required
                />
                {errors.securityAnswer && (
                  <p className="loginSignup-error-message">
                    {errors.securityAnswer}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="loginSignup-auth-btn signup"
              disabled={loading}
              onClick={handleSubmit}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;
