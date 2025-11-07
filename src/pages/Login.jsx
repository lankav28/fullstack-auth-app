import React, { useState } from "react";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  // ✅ useAuth to manage login globally
  const { login } = useAuth();

  // ✅ States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🟢 Sending login request...");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      console.log("🧾 Response from backend:", data);

      if (response.ok) {
        // ✅ Save token & user in context/localStorage
        login(data.token, data.user);

        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("❌ Network Error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fff7fb 0%, #ffe6f1 50%, #fbcfe8 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }
        .login-container::before,
        .login-container::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
          animation: float 8s ease-in-out infinite;
        }
        .login-container::before {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle at center, #f9a8d4, #fbcfe8);
          top: -200px;
          right: -150px;
          animation-delay: 1s;
        }
        .login-container::after {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle at center, #a78bfa, #fbcfe8);
          bottom: -150px;
          left: -100px;
        }
        .login-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 28px;
          padding: 48px 40px;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 20px 50px rgba(236, 72, 153, 0.2);
          animation: fadeInUp 0.8s ease;
          border: 1px solid rgba(255, 182, 193, 0.4);
        }
        .icon-wrapper {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #f9a8d4 0%, #f472b6 100%);
          border-radius: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto 24px;
          box-shadow: 0 10px 30px rgba(236, 72, 153, 0.3);
          animation: float 6s ease-in-out infinite;
        }
        .login-title {
          font-weight: 700;
          font-size: 28px;
          color: #1a1a1a;
          margin-bottom: 8px;
          text-align: center;
        }
        .login-subtitle {
          color: #666;
          font-size: 15px;
          text-align: center;
          margin-bottom: 32px;
        }
        .form-group { margin-bottom: 22px; }
        .form-label {
          font-weight: 600;
          color: #444;
          margin-bottom: 8px;
          font-size: 14px;
          display: block;
        }
        .form-input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #ffe6f1;
          border-radius: 14px;
          font-size: 15px;
          transition: all 0.3s ease;
          background: #fff;
          color: #1a1a1a;
        }
        .form-input:focus {
          border-color: #f9a8d4;
          box-shadow: 0 0 0 4px rgba(249, 168, 212, 0.2);
          transform: translateY(-2px);
        }
        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #f472b6 0%, #a78bfa 100%);
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
          position: relative;
          overflow: hidden;
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .error-alert {
          background: linear-gradient(135deg, #fda4af 0%, #f43f5e 100%);
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 4px 15px rgba(244, 63, 94, 0.25);
        }
        .signup-link {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: #666;
        }
        .signup-link a {
          color: #f472b6;
          text-decoration: none;
          font-weight: 600;
        }
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <div className="icon-wrapper">
            <LogIn size={36} color="white" strokeWidth={2.5} />
          </div>

          <h3 className="login-title">Welcome Back</h3>
          <p className="login-subtitle">Sign in to your dashboard ✨</p>

          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                minLength={6}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="signup-link">
            Don’t have an account? <a href="/register">Create one now</a>
          </div>
        </div>
      </div>
    </>
  );
}
