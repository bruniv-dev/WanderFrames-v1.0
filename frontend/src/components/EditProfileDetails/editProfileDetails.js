import React, { useState, useRef, useEffect } from "react";
import AvatarEditor from "react-avatar-editor";
import imageCompression from "browser-image-compression";
import {
  updateUserProfile,
  checkUsernameAvailability,
  fetchUserProfile,
} from "../api-helpers/helpers";
import "./EditProfileDetails.css";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Header/header";

const EditProfileDetails = () => {
  const location = useLocation();
  const { userId } = location.state || {}; // Access userId from location state
  const [user, setUser] = useState(null);
  const [username, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("Hi, I'm excited to share my travel diaries.");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageScale, setImageScale] = useState(1.2);
  const [error, setError] = useState(null);
  const [usernameStatus, setUsernameStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Added state for success message
  const navigate = useNavigate();
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.error("User ID is not defined.");
        setError("User ID is not defined.");
        return;
      }

      try {
        const userData = await fetchUserProfile(userId);
        setUser(userData.user);
        setUserName(userData.user.username);
        setFirstName(userData.user.firstName);
        setLastName(userData.user.lastName);
        setBio(
          userData.user.bio || "Hi, I'm excited to share my travel diaries."
        );
        if (userData.user.profileImage) {
          setImagePreview(userData.user.profileImage);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (username && user && username !== user.username) {
        try {
          const isAvailable = await checkUsernameAvailability(username);
          if (isAvailable) {
            setUsernameStatus("Username is available.");
          } else {
            setUsernameStatus("Username is already taken.");
          }
        } catch (err) {
          setUsernameStatus("Error checking username availability.");
        }
      } else {
        setUsernameStatus("");
      }
    };

    const debounce = setTimeout(checkAvailability, 300);

    return () => clearTimeout(debounce);
  }, [username, user]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("No file selected.");
      return;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      setProfileImage(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Error compressing image:", error);
      setError("Failed to compress image.");
    }
  };

  const handleScaleChange = (e) => {
    setImageScale(parseFloat(e.target.value));
  };

  const getCroppedImage = () => {
    if (editorRef.current) {
      return new Promise((resolve) => {
        editorRef.current.getImageScaledToCanvas().toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      });
    }
    return Promise.resolve(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      user &&
      username !== user.username &&
      usernameStatus === "Username is already taken."
    ) {
      setError("Username already taken.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("bio", bio);

      if (profileImage) {
        const editedImage = await getCroppedImage();
        if (editedImage) {
          formData.append("profileImage", editedImage, "profile-image.jpg");
        }
      }

      const response = await updateUserProfile(userId, formData);

      if (response && response.user) {
        setSuccessMessage("Profile successfully updated."); // Set success message
        setTimeout(() => {
          navigate(`/profile`);
        }, 1000); // Redirect after showing the success message
      } else {
        throw new Error("Unexpected response structure.");
      }
    } catch (err) {
      console.error("Error updating user profile:", err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/profile`);
  };

  return (
    <>
      <Header
        classNameheader="favorites-header"
        classNamelogo="favorites-logo"
        classNamenav="favorites-nav"
        classNamesignin="favorites-signin"
      />

      <div className="edit-profile-page">
        <div className="edit-profile-content">
          <form onSubmit={handleSubmit} className="edit-profile-form">
            <div className="left-section">
              {imagePreview && (
                <div className="avatar-editor-container">
                  <AvatarEditor
                    ref={editorRef}
                    image={imagePreview}
                    width={250}
                    height={250}
                    border={50}
                    borderRadius={125}
                    color={[255, 255, 255, 0.6]}
                    scale={imageScale}
                    rotate={0}
                  />
                  <div className="scale-controls">
                    <label htmlFor="scale">Scale:</label>
                    <input
                      type="range"
                      id="scale"
                      min="1"
                      max="2"
                      step="0.01"
                      value={imageScale}
                      onChange={handleScaleChange}
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id="images"
                    onChange={handleImageChange}
                    className="editProfileDetails-choose-file"
                  />
                  {error && <p className="error-message">{error}</p>}
                  {successMessage && (
                    <p className="success-message">{successMessage}</p>
                  )}
                </div>
              )}
            </div>
            <div className="right-section">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <p
                  className={`username-status-message ${
                    usernameStatus.includes("available") ? "available" : ""
                  } ${
                    usernameStatus.includes("taken") &&
                    username !== user?.username
                      ? "taken"
                      : ""
                  }`}
                >
                  {usernameStatus}
                </p>
              </div>
              <div className="form-group">
                <div className="first-last">
                  <div>
                    <label htmlFor="firstName">First Name</label>
                    <input
                      name="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      type="text"
                      id="firstName"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      name="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      type="text"
                      id="lastName"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a little about yourself..."
                />
              </div>
              <div className="form-buttons">
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-button"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfileDetails;
