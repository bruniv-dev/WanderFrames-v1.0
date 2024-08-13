import React, { useState, useEffect } from "react";
import Header from "../Header/header.js";
import "./Inspirations.css";
import CardLayout from "../Card-layout/cardLayout.js";
import { getAllPosts, fetchUserDetailsById } from "../api-helpers/helpers.js";
import Loading from "../Loading/Loading.js";

const Inspirations = () => {
  const [cardsData, setCardsData] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setLoggedInUserId(userId);
      setUserLoggedIn(true);
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);

        const data = await getAllPosts();
        const postsWithUserNames = await Promise.all(
          data.posts.map(async (post) => {
            try {
              const user = await fetchUserDetailsById(post.user);
              return {
                ...post,
                userName: user.username || "Unknown",
                lastName: user.lastName || "Unknown",
                firstName: user.firstName || "Unknown",
              };
            } catch {
              return {
                ...post,
                userName: "Unknown",
                firstName: "Unknown",
                lastName: "Unknown",
              };
            } finally {
              setLoading(false);
            }
          })
        );

        const filteredPosts = userId
          ? postsWithUserNames.filter((post) => post.user !== userId)
          : postsWithUserNames;

        setCardsData(filteredPosts);
        setFilteredCards(filteredPosts);
      } catch (e) {
        console.log(e);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCards(cardsData);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = cardsData.filter((card) => {
        const userName = card.userName || "";
        const location = card.location || "";
        const subLocation = card.subLocation || "";
        const firstName = card.firstName || "";
        const lastName = card.lastName || "";
        const fullName = `${card.firstName} ${card.lastName}` || "";
        return (
          userName.toLowerCase().includes(lowercasedTerm) ||
          firstName.toLowerCase().includes(lowercasedTerm) ||
          lastName.toLowerCase().includes(lowercasedTerm) ||
          location.toLowerCase().includes(lowercasedTerm) ||
          subLocation.toLowerCase().includes(lowercasedTerm) ||
          fullName.toLowerCase().includes(lowercasedTerm)
        );
      });
      setFilteredCards(filtered);
    }
  }, [searchTerm, cardsData]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (!userLoggedIn) {
      setShowPopup(true);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Header
        classNameheader="inspirations-header"
        classNamelogo="inspirations-logo"
        classNamenav="inspirations-nav"
        classNamesignin="inspirations-signin"
      />
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by username, location, or sublocation"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button onClick={() => handleSearch(searchTerm)}>Search</button>
      </div>
      <div className="inspirations-container">
        <CardLayout cardsData={filteredCards} onCardClick={handleCardClick} />
      </div>
    </>
  );
};

export default Inspirations;
