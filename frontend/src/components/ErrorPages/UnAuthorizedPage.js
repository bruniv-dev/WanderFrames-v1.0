import React from "react";
import { Link } from "react-router-dom";
import "./UnAuthorizedPage.css";

const UnAuthorizedPage = () => {
  return (
    <div className="unauthorized-container">
      <h1 className="unauthorized-title">403: Unauthorized</h1>
      <p className="unauthorized-message">
        Sorry, You do not have permission to access this page or perform this
        action.
      </p>
      <Link to="/inspirations" className="unauthorized-back-btn">
        Back to Inspirations
      </Link>
    </div>
  );
};

export default UnAuthorizedPage;
