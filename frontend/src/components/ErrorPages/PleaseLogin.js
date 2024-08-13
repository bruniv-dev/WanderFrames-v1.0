import React from "react";
import { Link } from "react-router-dom";
import "./PleaseLogin.css";

const PleaseLogin = () => {
  return (
    <div className="please-login-container">
      <h1 className="please-login-title">Login to Wander Frames</h1>
      <p className="please-login-message">
        Sorry, You need to be logged in to access this page.
      </p>
      <Link to="/loginSignup" className="please-login-back-btn">
        Go to Login
      </Link>
    </div>
  );
};

export default PleaseLogin;
