import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { serverUrl } from "../../constants";

function EditProfileModal({ isOpen, closeModal }) {
  const username = localStorage.getItem("username");

  const [profilePhoto, setProfilePhoto] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) return;

    try {
      setLoading(true);

      const { data } = await axios.put(
        `${serverUrl}/api/users/profile/${username}`,
        {
          profilePhoto,
          role,
          location,
          about,
        }
      );

      // Notify profile page to update instantly
      window.dispatchEvent(
        new CustomEvent("userProfileUpdated", {
          detail: data,
        })
      );

      closeModal();
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Edit Profile Modal"
      className="flex justify-center items-center mx-auto mt-20 max-w-md rounded-lg bg-gray-900 p-6 shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="w-full">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8"
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Profile Photo
            </label>
            <input
              value={profilePhoto}
              onChange={(e) => setProfilePhoto(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
              type="text"
              placeholder="Enter profile photo link"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Role
            </label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
              type="text"
              placeholder="Enter role"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Location
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
              type="text"
              placeholder="Enter location"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              About
            </label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
              placeholder="Enter about"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Submit"}
            </button>

            <button
              onClick={closeModal}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              type="button"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default EditProfileModal;