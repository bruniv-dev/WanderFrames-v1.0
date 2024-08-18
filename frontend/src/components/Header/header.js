import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions, logoutUser } from "../../store/authSlice"; // Ensure correct import path
import "./Header.css";
import { Link } from "react-router-dom";

const Header = ({
  classNameheader,
  classNamelogo,
  classNamenav,
  classNamesignin,
}) => {
  const authState = useSelector((state) => state.auth);
  const { isLoggedIn, isAdmin } = authState || {
    isLoggedIn: false,
    isAdmin: false,
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()); // Dispatch the logout action
      document.cookie = "token=; Max-Age=0; path=/"; // Force clear the cookie
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
      name: "Post Actions",
      id: "post-actions",
      path: "/post-actions",
    },
  ];

  const navLinks = isLoggedIn
    ? isAdmin
      ? [...loggedInLinks, ...adminLink]
      : loggedInLinks
    : generalLinks;

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
      {isLoggedIn ? (
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
