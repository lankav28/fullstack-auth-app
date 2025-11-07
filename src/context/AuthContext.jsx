// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./AuthContext.css";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [isVisible, setIsVisible] = useState(false);
  const fetchedOnce = useRef(false);

  // ✅ Verify token on initial load
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const checkAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${savedToken}` },
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.user) {
          setUser(data.user);
          setToken(savedToken);
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("✅ User verified:", data.user);
        } else {
          console.warn("⚠️ Invalid or expired token, clearing session...");
          logout(false); // silent logout
        }
      } catch (err) {
        console.error("❌ Auth check failed:", err.message);
        logout(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ Login
  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    showToast("🎉 Login successful!", "success");
  };

  // ✅ Logout (with optional redirect)
  const logout = (redirect = true) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    if (redirect) {
      showToast("👋 Logged out successfully!", "info");
      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    }
  };

  // ✅ Fetch profile manually
  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.warn("⚠️ Profile fetch failed:", err.message);
    }
  };

  // ✅ Toast
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setToast({ message: "", type: "" }), 300);
    }, 3000);
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

  const value = useMemo(
    () => ({ user, token, loading, login, logout, fetchProfile, showToast }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}

      {toast.message && (
        <div className={`modern-toast-container ${isVisible ? "show" : ""}`}>
          <div className={`modern-toast ${getToastClass(toast.type)}`}>
            <div className="toast-content">
              <div className="toast-message">{toast.message}</div>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
