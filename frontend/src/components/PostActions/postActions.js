import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/header.js";
import "./PostAction.css";
import CardLayout from "../Card-layout/cardLayout.js";
import {
  getAllPosts,
  deletePostById,
  fetchUserDetailsById,
} from "../api-helpers/helpers.js";
import Search from "../Search/Search.js";
import Loading from "../Loading/Loading.js";

const PostActions = () => {
  const [cardsData, setCardsData] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (!isAdmin) {
      navigate("/unauthorized");
    } else {
      setLoading(true);
      getAllPosts()
        .then(async (data) => {
          const postsWithUserNames = await Promise.all(
            data.posts.map(async (post) => {
              try {
                const user = await fetchUserDetailsById(post.user);
                return {
                  ...post,
                  userName: user.username || "Unknown",
                  lastName: user.lastName || "Unknown",
                  firstName: user.firstName || "Unknown",
                  role: user.role || "user", // Add role to the post data
                };
              } catch {
                return {
                  ...post,
                  userName: "Unknown",
                  firstName: "Unknown",
                  lastName: "Unknown",
                  role: "user", // Default role
                };
              }
            })
          );
          setCardsData(postsWithUserNames);
          setFilteredCards(postsWithUserNames);
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [navigate]);

  const handleSearchAndFilter = () => {
    const lowercasedTerm = searchTerm.toLowerCase();

    const filtered = cardsData.filter((card) => {
      const userName = card.userName || "";
      const location = card.location || "";
      const subLocation = card.subLocation || "";
      const firstName = card.firstName || "";
      const lastName = card.lastName || "";
      const fullName = `${card.firstName} ${card.lastName}` || "";

      const matchesSearchTerm =
        userName.toLowerCase().includes(lowercasedTerm) ||
        location.toLowerCase().includes(lowercasedTerm) ||
        subLocation.toLowerCase().includes(lowercasedTerm) ||
        firstName.toLowerCase().includes(lowercasedTerm) ||
        lastName.toLowerCase().includes(lowercasedTerm) ||
        fullName.toLowerCase().includes(lowercasedTerm);

      const matchesRole =
        roleFilter === "all" ||
        card.role.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearchTerm && matchesRole;
    });

    setFilteredCards(filtered);
  };

  const handleAdminDelete = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePostById(postId)
        .then(() => {
          setCardsData(cardsData.filter((post) => post._id !== postId));
          setFilteredCards(filteredCards.filter((post) => post._id !== postId));
        })
        .catch((e) => console.log(e));
    }
  };

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchTerm, roleFilter, cardsData]);

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return isAdmin ? (
    <>
      {loading && <Loading />}
      <Header
        classNameheader="postActions-header"
        classNamelogo="postActions-logo"
        classNamenav="postActions-nav"
        classNamesignin="postActions-signin"
      />
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by username, location, or sublocation"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="role-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <button onClick={() => handleSearchAndFilter()}>Search</button>
      </div>
      <div className="postActions-container">
        <CardLayout
          cardsData={filteredCards}
          onAdminDelete={handleAdminDelete}
          isAdminContext={true}
        />
      </div>
    </>
  ) : null;
};

export default PostActions;
