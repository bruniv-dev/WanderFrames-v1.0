// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getAllUsers,
//   deleteUserById,
//   updateUserIsAdmin,
// } from "../api-helpers/helpers";
// import UserCard from "../UserCard/userCard";
// import "./UserActions.css";
// import Header from "../Header/header";
// import Search from "../Search/Search.js";
// import Loading from "../Loading/Loading.js";

// const UserActions = () => {
//   const [usersData, setUsersData] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterCategory, setFilterCategory] = useState("all"); // New state for category filter
//   const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
//   const [loggedInUserId, setLoggedInUserId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedIsAdmin = localStorage.getItem("isAdmin") === "true";
//     const storedUserId = localStorage.getItem("userId");
//     setCurrentUserIsAdmin(storedIsAdmin);
//     setLoggedInUserId(storedUserId);

//     if (!storedIsAdmin) {
//       navigate("/unauthorized");
//     } else {
//       setLoading(true);
//       getAllUsers()
//         .then((data) => {
//           setUsersData(data.users);
//         })
//         .catch((e) => console.log(e))
//         .finally(() => {
//           setLoading(false);
//         });
//     }
//   }, [navigate]);

//   useEffect(() => {
//     handleSearchAndFilter();
//   }, [searchQuery, usersData, filterCategory]);

//   const handleSearchAndFilter = () => {
//     const lowercasedQuery = searchQuery.toLowerCase();

//     let filtered = usersData.filter((user) => {
//       const fullName = `${user.firstName} ${user.lastName}`;
//       const matchesQuery =
//         user.username.toLowerCase().includes(lowercasedQuery) ||
//         user.firstName.toLowerCase().includes(lowercasedQuery) ||
//         user.lastName.toLowerCase().includes(lowercasedQuery) ||
//         user.email.toLowerCase().includes(lowercasedQuery) ||
//         user._id.toLowerCase().includes(lowercasedQuery) ||
//         fullName.toLowerCase().includes(lowercasedQuery);

//       const matchesCategory =
//         filterCategory === "all" ||
//         (filterCategory === "admin" && user.isAdmin) ||
//         (filterCategory === "user" && !user.isAdmin);

//       return matchesQuery && matchesCategory;
//     });

//     // Ensure the logged-in user is displayed first
//     filtered = filtered.sort((a, b) => {
//       if (a._id === loggedInUserId) return -1; // Logged-in user comes first
//       if (b._id === loggedInUserId) return 1;
//       return 0;
//     });

//     setFilteredUsers(filtered);
//   };

//   const handleAdminDelete = (userId) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       deleteUserById(userId)
//         .then(() => {
//           setUsersData(usersData.filter((user) => user._id !== userId));
//         })
//         .catch((e) => console.log(e));
//     }
//   };

//   const makeAdmin = (userId) => {
//     if (window.confirm("Are you sure you want to make this user an admin?")) {
//       updateUserIsAdmin(userId, true)
//         .then((updatedUser) => {
//           const updatedUsers = usersData.map((user) =>
//             user._id === userId
//               ? { ...user, isAdmin: updatedUser.isAdmin }
//               : user
//           );
//           setUsersData(updatedUsers);
//         })
//         .catch((e) => console.log(e));
//     }
//   };

//   const removeAdmin = (userId) => {
//     if (
//       window.confirm(
//         "Are you sure you want to remove admin privileges from this user?"
//       )
//     ) {
//       updateUserIsAdmin(userId, false)
//         .then((updatedUser) => {
//           const updatedUsers = usersData.map((user) =>
//             user._id === userId
//               ? { ...user, isAdmin: updatedUser.isAdmin }
//               : user
//           );
//           setUsersData(updatedUsers);
//         })
//         .catch((e) => console.log(e));
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleCategoryChange = (e) => {
//     setFilterCategory(e.target.value);
//   };

//   return (
//     <>
//       {loading && <Loading />}
//       <Header
//         classNameheader="postActions-header"
//         classNamelogo="postActions-logo"
//         classNamenav="postActions-nav"
//         classNamesignin="postActions-signin"
//       />
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Search by username, firstname, lastname, email or role"
//           value={searchQuery}
//           onChange={handleSearchChange}
//         />
//         <select
//           className="role-select"
//           value={filterCategory}
//           onChange={handleCategoryChange}
//         >
//           <option value="all">All</option>
//           <option value="admin">Admin</option>
//           <option value="user">User</option>
//         </select>
//         <button onClick={() => handleSearchAndFilter()}>Search</button>
//       </div>
//       <div className="user-actions-container">
//         {filteredUsers.map((user) => (
//           <UserCard
//             key={user._id}
//             userId={user._id}
//             username={user.username}
//             firstName={user.firstName}
//             lastName={user.lastName}
//             createdAt={user.createdAt}
//             email={user.email}
//             bio={user.bio}
//             role={user.role}
//             profileImage={user.profileImage}
//             isAdmin={user.isAdmin}
//             onAdminDelete={handleAdminDelete}
//             makeAdmin={makeAdmin}
//             removeAdmin={removeAdmin}
//             currentUserIsAdmin={currentUserIsAdmin}
//             loggedInUserId={loggedInUserId}
//           />
//         ))}
//       </div>
//     </>
//   );
// };

// export default UserActions;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  deleteUserById,
  updateUserIsAdmin,
  fetchUserDetailsByToken,
  fetchUserDetailsById,
} from "../api-helpers/helpers";
import UserCard from "../UserCard/userCard";
import "./UserActions.css";
import Header from "../Header/header";
import Loading from "../Loading/Loading.js";

const UserActions = () => {
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all"); // New state for category filter
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchUserDetailsByToken()
      .then((tokenData) => {
        const userId = tokenData.userId;
        setLoggedInUserId(userId);

        return fetchUserDetailsById(userId);
      })
      .then((userDetails) => {
        setCurrentUserIsAdmin(userDetails.isAdmin);

        if (!userDetails.isAdmin) {
          navigate("/unauthorized");
        } else {
          return getAllUsers();
        }
      })
      .then((data) => {
        setUsersData(data.users);
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchQuery, usersData, filterCategory]);

  const handleSearchAndFilter = () => {
    const lowercasedQuery = searchQuery.toLowerCase();

    let filtered = usersData.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;
      const matchesQuery =
        user.username.toLowerCase().includes(lowercasedQuery) ||
        user.firstName.toLowerCase().includes(lowercasedQuery) ||
        user.lastName.toLowerCase().includes(lowercasedQuery) ||
        user.email.toLowerCase().includes(lowercasedQuery) ||
        user._id.toLowerCase().includes(lowercasedQuery) ||
        fullName.toLowerCase().includes(lowercasedQuery);

      const matchesCategory =
        filterCategory === "all" ||
        (filterCategory === "admin" && user.isAdmin) ||
        (filterCategory === "user" && !user.isAdmin);

      return matchesQuery && matchesCategory;
    });

    // Ensure the logged-in user is displayed first
    filtered = filtered.sort((a, b) => {
      if (a._id === loggedInUserId) return -1; // Logged-in user comes first
      if (b._id === loggedInUserId) return 1;
      return 0;
    });

    setFilteredUsers(filtered);
  };

  const handleAdminDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserById(userId)
        .then(() => {
          setUsersData(usersData.filter((user) => user._id !== userId));
        })
        .catch((e) => console.log(e));
    }
  };

  const makeAdmin = (userId) => {
    if (window.confirm("Are you sure you want to make this user an admin?")) {
      updateUserIsAdmin(userId, true)
        .then((updatedUser) => {
          const updatedUsers = usersData.map((user) =>
            user._id === userId
              ? { ...user, isAdmin: updatedUser.isAdmin }
              : user
          );
          setUsersData(updatedUsers);
        })
        .catch((e) => console.log(e));
    }
  };

  const removeAdmin = (userId) => {
    if (
      window.confirm(
        "Are you sure you want to remove admin privileges from this user?"
      )
    ) {
      updateUserIsAdmin(userId, false)
        .then((updatedUser) => {
          const updatedUsers = usersData.map((user) =>
            user._id === userId
              ? { ...user, isAdmin: updatedUser.isAdmin }
              : user
          );
          setUsersData(updatedUsers);
        })
        .catch((e) => console.log(e));
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
  };

  return (
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
          placeholder="Search by username, firstname, lastname, email or role"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select
          className="role-select"
          value={filterCategory}
          onChange={handleCategoryChange}
        >
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <button onClick={() => handleSearchAndFilter()}>Search</button>
      </div>
      <div className="user-actions-container">
        {filteredUsers.map((user) => (
          <UserCard
            key={user._id}
            userId={user._id}
            username={user.username}
            firstName={user.firstName}
            lastName={user.lastName}
            createdAt={user.createdAt}
            email={user.email}
            bio={user.bio}
            role={user.role}
            profileImage={user.profileImage}
            isAdmin={user.isAdmin}
            onAdminDelete={handleAdminDelete}
            makeAdmin={makeAdmin}
            removeAdmin={removeAdmin}
            currentUserIsAdmin={currentUserIsAdmin}
            loggedInUserId={loggedInUserId}
          />
        ))}
      </div>
    </>
  );
};

export default UserActions;
