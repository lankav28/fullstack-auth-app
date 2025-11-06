import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./ProfileModal.css";

const ProfileModal = ({ onClose, onSuccess, token, user }) => {
  const { showToast } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.body.classList.add("modal-open");
    setTimeout(() => setIsVisible(true), 10);
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, bio }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("✅ Profile updated successfully!", "success");
        onSuccess();
        setTimeout(handleClose, 800);
      } else {
        setError(data.message || "Failed to update profile");
        showToast("❌ Failed to update profile", "error");
      }
    } catch {
      setError("Network error. Please try again.");
      showToast("⚠️ Network error. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`profile-modal-backdrop ${isVisible ? "show" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`profile-modal-dialog ${isVisible ? "show" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-modal-content">
          {/* Header */}
          <div className="profile-modal-header">
            <div className="header-content">
              <div className="header-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h5 className="modal-title">Edit Profile</h5>
                <p className="modal-subtitle">Update your personal information</p>
              </div>
            </div>
            <button
              type="button"
              className="modern-close-btn"
              onClick={handleClose}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="profile-modal-body">
            {error && (
              <div className="modern-alert modern-alert-error">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="modern-form-group">
                <label className="modern-label">
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="modern-input"
                  placeholder="Enter your name"
                />
              </div>

              <div className="modern-form-group">
                <label className="modern-label">Email</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="modern-input disabled"
                  />
                  <span className="lock-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                </div>
                <div className="modern-hint">Email cannot be changed</div>
              </div>

              <div className="modern-form-group">
                <label className="modern-label">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  maxLength={500}
                  className="modern-textarea"
                  placeholder="Tell us about yourself..."
                ></textarea>
                <div className="character-count">
                  <span className={bio.length > 450 ? "warning" : ""}>
                    {bio.length}/500
                  </span>
                </div>
              </div>

              <div className="profile-modal-footer">
                <button
                  type="button"
                  className="modern-btn modern-btn-secondary"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modern-btn modern-btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="modern-spinner"></span> Saving...
                    </>
                  ) : (
                    <>
                      <span>Update Profile</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
