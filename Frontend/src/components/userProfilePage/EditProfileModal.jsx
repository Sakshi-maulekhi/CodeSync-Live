import React, { useState } from "react";
import Modal from "react-modal";

function EditProfileModal({ isOpen, closeModal, onSubmit }) {
  const [profilePhoto, setProfilePhoto] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await onSubmit({ profilePhoto, role, location, about });
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Edit Profile Modal"
      className="mx-auto mt-10 w-[92%] max-w-lg rounded-3xl border border-slate-800/80 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/80 outline-none"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm"
      ariaHideApp={false}
    >
      <div className="w-full">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            Update profile
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Tell the community more about yourself</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Profile Photo
            </label>
            <input
              value={profilePhoto}
              onChange={(e) => setProfilePhoto(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-blue-500"
              type="text"
              placeholder="Enter profile photo link"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Role
            </label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-blue-500"
              type="text"
              placeholder="Enter role"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Location
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-blue-500"
              type="text"
              placeholder="Enter location"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              About
            </label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="min-h-28 w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-blue-500"
              placeholder="Tell people about yourself"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={closeModal}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-indigo-500"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default EditProfileModal;