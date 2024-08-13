import React from "react";
import { Link } from "react-router-dom";
import "./PageNotFound.css";

const PageNotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404: Not Found</h1>
      <p className="not-found-message">
        Sorry, We can’t seem to find the page you’re looking for..
      </p>
      <Link to="/inspirations" className="not-found-back-btn">
        Back to Inspirations
      </Link>
    </div>
  );
};

export default PageNotFound;
