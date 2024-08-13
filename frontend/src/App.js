import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./components/Home/home.js";
import Inspirations from "./components/Inspirations/inspirations.js";
import Profile from "./components/Profile/profile.js";
import Favorites from "./components/Favorites/favorites.js";
import Upload from "./components/Upload/upload.js";
import SignIn from "./components/SignIn/signIn.js";
import EditPost from "./components/EditPost/editPost.js";
import ForgotPassword from "./components/ForgotPassword/forgotPassword.js";
import ResetPassword from "./components/ResetPassword/resetPassword.js";
import PostActions from "./components/PostActions/postActions.js";
import UserActions from "./components/UserActions/userActions.js";
import UserProfile from "./components/UserProfile/userProfile.js";
import PleaseLogin from "./components/ErrorPages/PleaseLogin.js";
import PageNotFound from "./components/ErrorPages/PageNotFound.js";
import UnAuthorizedPage from "./components/ErrorPages/UnAuthorizedPage.js";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.js";
import EditProfileDetails from "./components/EditProfileDetails/editProfileDetails.js";

const App = () => {
  const isloggedIn = useSelector((state) => state.isloggedIn);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inspirations" element={<Inspirations />} />
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
        <Route
          path="/userProfile"
          element={<ProtectedRoute element={UserProfile} />}
        />
        <Route path="/upload" element={<ProtectedRoute element={Upload} />} />
        <Route
          path="/favorites"
          element={<ProtectedRoute element={Favorites} />}
        />
        <Route
          path="/editPost"
          element={<ProtectedRoute element={EditPost} />}
        />
        <Route
          path="/editProfile"
          element={<ProtectedRoute element={EditProfileDetails} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/post-actions"
          element={<ProtectedRoute element={PostActions} />}
        />
        <Route
          path="/user-actions"
          element={<ProtectedRoute element={UserActions} />}
        />
        <Route path="/loginSignup" element={<SignIn />} />
        <Route path="/please-login" element={<PleaseLogin />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/unauthorized" element={<UnAuthorizedPage />} />
      </Routes>
    </Router>
  );
};

export default App;
