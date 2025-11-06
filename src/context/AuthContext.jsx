import React, { createContext, useContext, useState, useEffect } from "react";
import "./AuthContext.css"; // Import the CSS file below

// Create Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [isVisible, setIsVisible] = useState(false);

  // Auto-fetch profile on token change
  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Fetch user profile from backend
  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.error(err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    showToast("Login successful!", "success");
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    showToast("Logged out successfully!", "info");
  };

  // Show toast message with animation
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setToast({ message: "", type: "" }), 300);
    }, 3000);
  };

  const handleCloseToast = () => {
    setIsVisible(false);
    setTimeout(() => setToast({ message: "", type: "" }), 300);
  };

  const getToastIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      case "error":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      case "warning":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
    }
  };

  const getToastClass = (type) => {
    switch (type) {
      case "success":
        return "modern-toast-success";
      case "error":
        return "modern-toast-error";
      case "warning":
        return "modern-toast-warning";
      default:
        return "modern-toast-info";
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, fetchProfile, showToast }}
    >
      {children}

      {/* Modern Toast Notification */}
      {toast.message && (
        <div className={`modern-toast-container ${isVisible ? "show" : ""}`}>
          <div className={`modern-toast ${getToastClass(toast.type)}`}>
            <div className="toast-icon-wrapper">
              {getToastIcon(toast.type)}
            </div>
            
            <div className="toast-content">
              <div className="toast-message">{toast.message}</div>
            </div>

            <button
              type="button"
              className="toast-close-btn"
              onClick={handleCloseToast}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="toast-progress-bar"></div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);