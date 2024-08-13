import React, { useState } from "react";
import "./Home.css";
import Header from "../Header/header.js";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading.js";
import Popup from "../ErrorPages/PopupCard.js";

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleShareJourneyClick = () => {
    const isLoggedIn = Boolean(localStorage.getItem("userId"));
    if (isLoggedIn) {
      navigate("/upload");
    } else {
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleLoginRedirect = () => {
    handleClosePopup();
    navigate("/loginSignup");
  };

  const handleVideoLoad = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && <Loading />}
      <header>
        <Header
          classNameheader="header home-header"
          classNamelogo="logo home-logo"
          classNamenav="nav home-nav"
          classNamesignin="signin home-signin"
        />
      </header>
      <div className="home-container">
        <video autoPlay loop muted playsInline onLoadedData={handleVideoLoad}>
          <source
            src={`${process.env.PUBLIC_URL}/darkwoodsclip.mp4`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="home-flex">
          <h1 className="heading">WANDER FRAMES</h1>
          <h4 className="sub-heading">
            From your lens to the world: let your adventures inspire.
          </h4>

          <div className="home-hero-buttons">
            <Link
              to="/inspirations"
              className="home-hero-btn home-hero-button-1"
            >
              Explore Inspirations
            </Link>
            <button
              onClick={handleShareJourneyClick}
              className="home-hero-btn home-hero-button-2"
            >
              Share Your Journey
            </button>
          </div>
          <h6 className="slogan">
            CAPTURE <span>.</span> SHARE <span>.</span> INSPIRE
          </h6>
        </div>
        <Popup
          showPopup={showPopup}
          onClose={handleClosePopup}
          onConfirm={handleLoginRedirect}
          confirmText="Log In"
          message={{
            title: "Please Log In.",
            body: "You need to be signed in to add items to your favorites.",
          }}
        />
      </div>
    </>
  );
};

export default Home;
