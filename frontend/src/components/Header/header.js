import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store";
import "./Header.css";
import { Link } from "react-router-dom";
import { logoutUser } from "../api-helpers/helpers";

const Header = ({
  classNameheader,
  classNamelogo,
  classNamenav,
  classNamesignin,
}) => {
  const { isloggedIn, isAdmin } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser(); // Call the API to handle server-side logout
      document.cookie = "token=; Max-Age=0; path=/"; // Force clear the cookie
      localStorage.removeItem("userId");
      dispatch(authActions.logout()); // Clear auth state in Redux
      navigate("/loginSignup"); // Redirect to login/signup page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const generalLinks = [
    { name: "Home", id: "home", path: "/" },
    { name: "Inspirations", id: "inspirations", path: "/inspirations" },
  ];

  const loggedInLinks = [
    { name: "Home", id: "home", path: "/" },
    { name: "Profile", id: "profile", path: "/profile" },
    { name: "Upload", id: "upload", path: "/upload" },
    { name: "Inspirations", id: "inspirations", path: "/inspirations" },
    { name: "Favorites", id: "favorites", path: "/favorites" },
  ];

  const adminLink = [
    {
      name: "User Actions",
      id: "user-actions",
      path: "/user-actions",
    },
    {
      name: " Post Actions",
      id: "post-actions",
      path: "/post-actions",
    },
  ];

  const navLinks = isloggedIn
    ? isAdmin
      ? [...loggedInLinks, ...adminLink]
      : loggedInLinks
    : generalLinks;

  // const adminLink = {
  //   name: "User Actions",
  //   id: "user-actions",
  //   path: "/user-actions",
  // };

  // const navLinks = isloggedIn
  //   ? isAdmin
  //     ? [...loggedInLinks, adminLink]
  //     : loggedInLinks
  //   : generalLinks;

  return (
    <div className={`header ${classNameheader}`}>
      <Link to="/" className="logo-nav">
        <h3 className={`logo ${classNamelogo}`}>BRUNIV</h3>
      </Link>
      <nav className={`nav ${classNamenav}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.id}
            to={link.path}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
      {isloggedIn ? (
        <button className="sign-out" onClick={handleLogout}>
          Log Out
        </button>
      ) : (
        <button
          className={`sign-in ${classNamesignin}`}
          onClick={() => navigate("/loginSignup")}
        >
          Log In
        </button>
      )}
    </div>
  );
};

export default Header;
