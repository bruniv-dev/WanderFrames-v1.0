import React, { useState, useRef } from "react";
import "./Upload.css";
import Header from "../Header/header";
import { addPost } from "../api-helpers/helpers";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import Loading from "../Loading/Loading";

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const initialFormData = {
    images: [],
    location: "",
    subLocation: "",
    description: "",
    date: "",
    locationUrl: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalImagesCount = formData.images.length + selectedFiles.length;

    if (totalImagesCount > 3) {
      alert("You can select up to 3 images.");
      e.target.value = "";
      return;
    }

    // const compressedFiles = await Promise.all(
    //   selectedFiles.map((file) =>
    //     imageCompression(file, {
    //       maxSizeMB: 1,
    //       maxWidthOrHeight: 800,
    //       useWebWorker: true,
    //     })
    //   )
    // );

    const maxSizeKB = 500; // Desired max file size in KB
    const maxSizeMB = maxSizeKB / 1024; // Convert to MB

    const compressedFiles = await Promise.all(
      selectedFiles.map((file) =>
        imageCompression(file, {
          maxSizeMB: maxSizeMB, // Set max size in MB
          maxWidthOrHeight: 800,
          useWebWorker: true,
        })
      )
    );

    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...compressedFiles],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    formData.images.forEach((file) => {
      data.append("images", file);
    });
    data.append("location", formData.location);
    data.append("subLocation", formData.subLocation);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("user", localStorage.getItem("userId"));
    if (formData.locationUrl) {
      data.append("locationUrl", formData.locationUrl);
    }

    addPost(data)
      .then((response) => {
        console.log("Post added successfully:", response);
        navigate("/profile");
      })
      .catch((err) => console.error("Error adding post:", err))
      .finally(() => setLoading(true));
  };

  const handleCancel = () => {
    // Reset form data
    setFormData(initialFormData);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Header
        classNameheader="upload-header"
        classNamelogo="upload-logo"
        classNamenav="upload-nav"
        classNamesignin="upload-signin"
      />
      <div className="upload">
        <div className="upload-container">
          <form
            className="upload-form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="left-section">
              <label htmlFor="images" className="upload-label">
                Images (up to 3)
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleImageChange}
                  multiple
                  ref={fileInputRef}
                />
              </label>
              <label htmlFor="date" className="date upload-label">
                Date
                <input
                  type="date"
                  id="upload-date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="upload-input date"
                  required
                  max={today}
                />
              </label>
              <label htmlFor="locationUrl" className="locationUrl upload-label">
                Google Maps URL
                <input
                  type="url"
                  id="locationUrl"
                  name="locationUrl"
                  value={formData.locationUrl}
                  onChange={handleInputChange}
                  className="upload-input url"
                />
              </label>
            </div>
            <div className="right-section">
              <label htmlFor="location" className="upload-label">
                Location
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="upload-input"
                  required
                />
              </label>
              <label htmlFor="subLocation" className="upload-label">
                Sub-Location
                <input
                  type="text"
                  id="subLocation"
                  name="subLocation"
                  value={formData.subLocation}
                  onChange={handleInputChange}
                  className="upload-input"
                  required
                />
              </label>
              <label htmlFor="description" className="upload-label">
                Description
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="upload-input"
                  required
                />
              </label>
            </div>
            <div className="upload-buttons">
              <button type="submit" className="submit-button">
                Add
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Upload;
