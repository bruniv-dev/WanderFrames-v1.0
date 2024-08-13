import React, { useState, useEffect } from "react";
import {
  MdLocationOn,
  MdDeleteForever,
  MdEdit,
  MdMoreVert,
} from "react-icons/md";

import {
  toggleFavorite,
  fetchUserDetailsById,
  deletePostById,
} from "../api-helpers/helpers";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Card.css";
import { useNavigate } from "react-router-dom";
// import { HiMinusSm, HiPlus } from "react-icons/hi";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

// Custom arrow components with event propagation stop
const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} card-custom-prev-arrow`}
      style={{ ...style, display: "block" }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    />
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} card-custom-next-arrow`}
      style={{ ...style, display: "block" }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    />
  );
};

const Card = ({
  images = [],
  location,
  subLocation,
  description,
  date,
  _id,
  userId,
  locationUrl,
  onFavoriteToggle,
  onDelete,
  isAdmin,
  onAdminDelete,
  onCardClick,
  isProfile,
  isAdminContext,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isHovered, setIsHovered] = useState(false); // Track hover state
  const [menuVisible, setMenuVisible] = useState(false); // Track kebab menu visibility
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setLoggedInUserId(storedUserId);

    const favoritesKey = `favorites_${storedUserId}`;
    const favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];
    setIsFavorite(favorites.includes(_id));

    if (userId) {
      fetchUserDetailsById(userId)
        .then((user) => setUserDetails(user))
        .catch((err) => console.error("Error fetching user details:", err));
    }
  }, [_id, userId]);

  const updateFavoritesInLocalStorage = (newFavorites) => {
    const favoritesKey = `favorites_${loggedInUserId}`;
    localStorage.setItem(favoritesKey, JSON.stringify(newFavorites));
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (loggedInUserId) {
      if (_id) {
        toggleFavorite(_id)
          .then(() => {
            setIsFavorite((prevIsFavorite) => {
              const favoritesKey = `favorites_${loggedInUserId}`;
              const favorites =
                JSON.parse(localStorage.getItem(favoritesKey)) || [];
              const newFavorites = prevIsFavorite
                ? favorites.filter((favId) => favId !== _id)
                : [...favorites, _id];
              updateFavoritesInLocalStorage(newFavorites);
              if (onFavoriteToggle) {
                onFavoriteToggle();
              }
              return !prevIsFavorite;
            });
          })
          .catch((err) => console.log("Error in toggleFavorite:", err));
      } else {
        console.error("Post ID (_id) is missing");
      }
    } else {
      // Notify parent component to show the popup
      if (onFavoriteToggle) {
        onFavoriteToggle();
      }
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePostById(_id)
        .then(() => {
          if (onDelete) {
            onDelete(_id);
          }
        })
        .catch((err) => console.error("Error deleting post:", err));
    }
  };

  const handleAdminDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this post?")) {
      if (onAdminDelete) {
        onAdminDelete(_id);
      }
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate("/editPost", { state: { postId: _id } });
  };

  const handleUsernameClick = (e) => {
    e.stopPropagation();
    navigate("/userProfile", { state: { userId } });
  };

  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-GB", options).format(
      new Date(dateString)
    );
  };

  const uniqueImages = Array.from(new Set(images.map((img) => img.url))).map(
    (url) => images.find((img) => img.url === url)
  );

  const hasMultipleImages = uniqueImages.length > 1;

  const sliderSettings = {
    dots: hasMultipleImages,
    infinite: hasMultipleImages,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: isHovered && hasMultipleImages, // Enable autoplay only on hover
    autoplaySpeed: 3000,
    customPaging: (i) => <div className="card-custom-dot" />,
    dotsClass: "slick-dots card-custom-dots",
    prevArrow: hasMultipleImages ? <CustomPrevArrow /> : null,
    nextArrow: hasMultipleImages ? <CustomNextArrow /> : null,
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuVisible(!menuVisible);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  return (
    <div
      className="card-container"
      onClick={onCardClick}
      onMouseEnter={() => setIsHovered(true)} // Start autoplay on hover
      onMouseLeave={() => {
        setIsHovered(false); // Stop autoplay when not hovering
        closeMenu(); // Close menu when not hovering
      }}
    >
      <div className="card-image-slider">
        {uniqueImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {uniqueImages.map((img, index) => (
              <img
                key={index}
                className="card-slider-image"
                src={img.url}
                alt={`Slide ${index + 1}`}
              />
            ))}
          </Slider>
        ) : (
          <img
            className="card-slider-image"
            src="https://placehold.co/600x400"
            alt="Placeholder"
          />
        )}
      </div>
      <div className="card-content">
        <div className="loc-name-nav">
          <p className="card-location">{location}</p>
          {locationUrl && (
            <a href={locationUrl} target="_blank" rel="noopener noreferrer">
              <MdLocationOn className="card-location-button" />
            </a>
          )}
        </div>
        <p className="card-sub-location">{subLocation}</p>
        <p className={"card-description"}>{description}</p>
      </div>
      <div className="card-header">
        <img
          className="profile-image-card"
          src={userDetails.profileImage}
          alt="profilepic"
        />
        <div className="card-user-info">
          <p className="card-username" onClick={handleUsernameClick}>
            {userDetails.username || "Unknown User"}
          </p>
          <div className="card-last-row">
            <p className="card-role">
              {userDetails.isAdmin ? "Admin" : "User"}
            </p>
            <p className="card-date">{formatDate(date)}</p>
          </div>
        </div>
      </div>
      {!isAdminContext && (
        <button
          className={`card-add-to-favorites ${isFavorite ? "favorite" : ""}`}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? (
            <FaHeart className="isfav" />
          ) : (
            <FaRegHeart className="notfav" />
          )}
        </button>
      )}
      <div className="card-kebab-menu-container">
        <MdMoreVert className="card-kebab-menu-icon" onClick={toggleMenu} />
        {menuVisible && (
          <div className="card-kebab-menu">
            <div
              className="card-kebab-menu-item edit"
              onClick={handleEditClick}
            >
              <MdEdit className="card-kebab-menu-icon" /> Edit
            </div>
            <div className="card-kebab-menu-item" onClick={handleDeleteClick}>
              <MdDeleteForever className="card-kebab-menu-icon" /> Delete
            </div>
          </div>
        )}
      </div>
      {onAdminDelete && (
        <MdDeleteForever
          className="card-admin-delete-button"
          onClick={handleAdminDeleteClick}
        ></MdDeleteForever>
      )}
    </div>
  );
};

export default Card;
