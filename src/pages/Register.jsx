import React, { useState } from "react";
import { UserPlus } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Registration successful", data);
        window.location.href = "/login";
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
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
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        .register-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fff7fb 0%, #ffe6f1 50%, #fbcfe8 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .register-container::before,
        .register-container::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
          animation: float 8s ease-in-out infinite;
        }

        .register-container::before {
          width: 550px;
          height: 550px;
          background: radial-gradient(circle at center, #f9a8d4, #fbcfe8);
          top: -200px;
          right: -180px;
          animation-delay: 1s;
        }

        .register-container::after {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle at center, #a78bfa, #fbcfe8);
          bottom: -180px;
          left: -120px;
        }

        .register-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 28px;
          padding: 48px 40px;
          max-width: 460px;
          width: 100%;
          box-shadow: 0 20px 50px rgba(236, 72, 153, 0.2);
          animation: fadeInUp 0.8s ease;
          position: relative;
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

        .register-title {
          font-weight: 700;
          font-size: 28px;
          color: #1a1a1a;
          margin-bottom: 8px;
          text-align: center;
        }

        .register-subtitle {
          color: #666;
          font-size: 15px;
          text-align: center;
          margin-bottom: 32px;
        }

        .form-group {
          margin-bottom: 22px;
        }

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

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .submit-btn:hover::before {
          left: 100%;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(236, 72, 153, 0.3);
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

        .login-link {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: #666;
        }

        .login-link a {
          color: #f472b6;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .login-link a:hover {
          color: #a78bfa;
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

        @media (max-width: 576px) {
          .register-card { padding: 36px 28px; }
          .register-title { font-size: 24px; }
        }
      `}</style>

      <div className="register-container">
        <div className="register-card">
          <div className="icon-wrapper">
            <UserPlus size={36} color="white" strokeWidth={2.5} />
          </div>

          <h3 className="register-title">Create Account</h3>
          <p className="register-subtitle">Join the pookie dashboard ✨</p>

          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                minLength={2}
                required
              />
            </div>

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
                placeholder="Create a secure password"
                minLength={6}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="login-link">
            Already have an account? <a href="/login">Sign in here</a>
          </div>
        </div>
      </div>
    </>
  );
}
