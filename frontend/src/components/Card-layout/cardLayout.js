import React, { useState } from "react";
import Card from "../Card/card";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CardLayout.css";
import Popup from "../ErrorPages/PopupCard";
import { useNavigate } from "react-router-dom";

const CustomPrevArrow = ({ className, style, onClick }) => (
  <div
    className={`${className} custom-prev-arrow`}
    style={{ ...style, display: "block" }}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
  />
);

const CustomNextArrow = ({ className, style, onClick }) => (
  <div
    className={`${className} custom-next-arrow`}
    style={{ ...style, display: "block" }}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
  />
);

const CardLayout = ({
  cardsData,
  onFavoriteToggle,
  onDelete,
  onAdminDelete,
  isProfile,
  isAdminContext,
}) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({});
  const [popupConfirmText, setPopupConfirmText] = useState("");

  const openModal = (card) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };
  const navigate = useNavigate();
  const handlePopupConfirm = () => {
    if (popupConfirmText === "Log In") {
      navigate("/loginSignup");
      // For example, use navigate('/login') from react-router-dom here
    } else if (popupConfirmText === "Delete") {
      if (onAdminDelete) {
        onAdminDelete(selectedCard._id);
      } else if (onDelete) {
        onDelete(selectedCard._id);
      }
    }
    setShowPopup(false);
  };

  const handleFavoriteClick = (cardId) => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      if (typeof onFavoriteToggle === "function") {
        onFavoriteToggle(cardId);
      } else {
        console.error("onFavoriteToggle is not a function");
      }
    } else {
      setPopupMessage({
        title: "Please Sign In",
        body: "You need to be logged in to add items to your favorites.",
      });
      setPopupConfirmText("Log In");
      setShowPopup(true);
    }
  };

  if (!cardsData || !Array.isArray(cardsData)) {
    return <div>No cards available.</div>;
  }

  const sliderSettings = {
    dots: selectedCard && selectedCard.images.length > 1,
    infinite: selectedCard && selectedCard.images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: selectedCard && selectedCard.images.length > 1,
    autoplaySpeed: 3000,
    customPaging: (i) => <div className="card-custom-dot" />,
    dotsClass: "slick-dots card-custom-dots",
    prevArrow:
      selectedCard && selectedCard.images.length > 1 ? (
        <CustomPrevArrow />
      ) : null,
    nextArrow:
      selectedCard && selectedCard.images.length > 1 ? (
        <CustomNextArrow />
      ) : null,
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

  return (
    <div className="card-layout">
      {cardsData.map((card) => (
        <Card
          key={card._id}
          _id={card._id}
          userId={card.user}
          images={card.images}
          location={card.location}
          subLocation={card.subLocation}
          description={card.description}
          date={card.date}
          locationUrl={card.locationUrl}
          onFavoriteToggle={
            onFavoriteToggle ? () => onFavoriteToggle(card._id) : null
          }
          onDelete={onDelete}
          onAdminDelete={onAdminDelete ? () => onAdminDelete(card._id) : null}
          onCardClick={() => openModal(card)}
          isProfile={isProfile}
          isAdminContext={isAdminContext}
        />
      ))}

      {selectedCard && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <div className="modal-slider">
              <Slider {...sliderSettings}>
                {selectedCard.images.length > 0 ? (
                  selectedCard.images.map((img, index) => (
                    <img
                      key={index}
                      className="modal-slider-image"
                      src={img.url}
                      alt={`Slide ${index + 1}`}
                    />
                  ))
                ) : (
                  <img
                    className="modal-slider-image"
                    src="https://placehold.co/600x400"
                    alt="Placeholder"
                  />
                )}
              </Slider>
            </div>
            <p> {selectedCard.location}</p>
            <p> {selectedCard.subLocation}</p>
            <p> {selectedCard.description}</p>
            <p> {formatDate(selectedCard.date)}</p>
          </div>
        </div>
      )}

      {showPopup && (
        <Popup
          showPopup={showPopup}
          onClose={handlePopupClose}
          onConfirm={handlePopupConfirm}
          confirmText={popupConfirmText}
          message={popupMessage}
        />
      )}
    </div>
  );
};

export default CardLayout;
