// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { authActions } from "../../store/authSlice"; // Ensure correct import path
// import "./Header.css";
// import { Link } from "react-router-dom";

// const Header = ({
//   classNameheader,
//   classNamelogo,
//   classNamenav,
//   classNamesignin,
// }) => {
//   const authState = useSelector((state) => state.auth);
//   const { isLoggedIn, isAdmin } = authState || {
//     isLoggedIn: false,
//     isAdmin: false,
//   };

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       // Clear auth state in Redux
//       dispatch(authActions.logout());

//       // Clear localStorage
//       localStorage.removeItem("token");
//       localStorage.removeItem("isLoggedIn");
//       localStorage.removeItem("isAdmin");

//       // Redirect to login/signup page
//       navigate("/loginSignup");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   const generalLinks = [
//     { name: "Home", id: "home", path: "/" },
//     { name: "Inspirations", id: "inspirations", path: "/inspirations" },
//   ];

//   const loggedInLinks = [
//     { name: "Home", id: "home", path: "/" },
//     { name: "Profile", id: "profile", path: "/profile" },
//     { name: "Upload", id: "upload", path: "/upload" },
//     { name: "Inspirations", id: "inspirations", path: "/inspirations" },
//     { name: "Favorites", id: "favorites", path: "/favorites" },
//   ];

//   const adminLink = [
//     {
//       name: "User Actions",
//       id: "user-actions",
//       path: "/user-actions",
//     },
//     {
//       name: "Post Actions",
//       id: "post-actions",
//       path: "/post-actions",
//     },
//   ];

//   const navLinks = isLoggedIn
//     ? isAdmin
//       ? [...loggedInLinks, ...adminLink]
//       : loggedInLinks
//     : generalLinks;

//   return (
//     <div className={`header ${classNameheader}`}>
//       <Link to="/" className="logo-nav">
//         <h3 className={`logo ${classNamelogo}`}>BRUNIV</h3>
//       </Link>
//       <nav className={`nav ${classNamenav}`}>
//         {navLinks.map((link) => (
//           <NavLink
//             key={link.id}
//             to={link.path}
//             className={({ isActive }) => (isActive ? "active" : "")}
//           >
//             {link.name}
//           </NavLink>
//         ))}
//       </nav>
//       {isLoggedIn ? (
//         <button className="sign-out" onClick={handleLogout}>
//           Log Out
//         </button>
//       ) : (
//         <button
//           className={`sign-in ${classNamesignin}`}
//           onClick={() => navigate("/loginSignup")}
//         >
//           Log In
//         </button>
//       )}
//     </div>
//   );
// };

// export default Header;

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/authSlice"; // Ensure correct import path
import "./Header.css";
import { Link } from "react-router-dom";
import axios from "axios";

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
      // Make an API call to logout the user on the server
      await axios.post("/user/logout", {}, { withCredentials: true });

      // Clear auth state in Redux
      dispatch(authActions.logout());

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("isAdmin");

      // Redirect to login/signup page
      navigate("/loginSignup");
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
