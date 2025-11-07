import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import "./AuthContext.css";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ Initialize from localStorage so first render is consistent
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Toast state
  const [toast, setToast] = useState({ message: "", type: "" });
  const [isVisible, setIsVisible] = useState(false);

  // Avoid double fetches (React Strict Mode in dev mounts twice)
  const fetchedOnce = useRef(false);

  useEffect(() => {
    // If we have a token, verify it and refresh profile
    if (!token) {
      setLoading(false);
      return;
    }

    // Prevent duplicate fetch in dev strict mode
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    fetchProfile().finally(() => {
      setLoading(false);
      // allow future refetches when token changes
      fetchedOnce.current = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        // Token invalid/expired – do a gentle logout
        console.warn("⚠️ Token invalid/expired, logging out");
        logout();
        return;
      }

      if (res.ok && data?.user) {
        setUser(data.user);
        // Keep localStorage user in sync for a clean first render on refresh
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("✅ Profile fetched successfully:", data.user);
      } else {
        console.warn("⚠️ Profile fetch returned no user data:", data);
      }
    } catch (err) {
      console.error("❌ Profile fetch failed:", err);
      // Don’t logout on network hiccups; just keep user as-is
      showToast("Network issue while fetching profile", "warning");
    }
  };

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    showToast("🎉 Login successful!", "success");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    showToast("👋 Logged out successfully!", "info");
  };

  // Toast helpers
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

  // Keep the context value stable across renders
  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      fetchProfile,
      showToast,
    }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}

      {toast.message && (
        <div className={`modern-toast-container ${isVisible ? "show" : ""}`}>
          <div className={`modern-toast ${getToastClass(toast.type)}`}>
            <div className="toast-icon-wrapper">{getToastIcon(toast.type)}</div>
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

// Hook
export const useAuth = () => useContext(AuthContext);
