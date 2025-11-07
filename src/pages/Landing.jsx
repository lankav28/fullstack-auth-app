import React from "react";
import { Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }

        body {
          margin: 0;
          font-family: "Poppins", sans-serif;
          overflow-x: hidden;
        }

        .landing-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fff7fb 0%, #ffe6f1 50%, #fbcfe8 100%);
          background-size: 200% 200%;
          animation: gradientFlow 10s ease infinite;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 40px;
          text-align: center;
        }

        .glow-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          z-index: 0;
        }
        .particle {
          position: absolute;
          background: radial-gradient(circle, rgba(236,72,153,0.3), transparent);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
        .particle:nth-child(1) { width: 80px; height: 80px; top: 10%; left: 20%; animation-delay: 0s; }
        .particle:nth-child(2) { width: 100px; height: 100px; bottom: 15%; right: 25%; animation-delay: 2s; }
        .particle:nth-child(3) { width: 60px; height: 60px; top: 40%; right: 10%; animation-delay: 1s; }

        .landing-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 28px;
          padding: 64px 48px;
          max-width: 600px;
          box-shadow: 0 20px 60px rgba(236, 72, 153, 0.2);
          animation: fadeInUp 1s ease;
          z-index: 1;
          border: 1px solid rgba(255, 182, 193, 0.4);
          position: relative;
        }

        .icon-wrapper {
          width: 90px;
          height: 90px;
          background: linear-gradient(135deg, #f9a8d4 0%, #f472b6 100%);
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 28px;
          box-shadow: 0 10px 30px rgba(236, 72, 153, 0.3);
          animation: float 6s ease-in-out infinite;
        }

        .landing-title {
          font-size: 34px;
          font-weight: 700;
          background: linear-gradient(90deg, #ec4899, #a78bfa, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: shimmer 6s linear infinite;
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .landing-subtitle {
          font-size: 16px;
          color: #666;
          margin-bottom: 40px;
          max-width: 420px;
          margin-left: auto;
          margin-right: auto;
        }

        .btn-group {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 14px 32px;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          position: relative;
          overflow: hidden;
          letter-spacing: 0.3px;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .btn:hover::before {
          left: 100%;
        }

        .btn-primary {
          background: linear-gradient(135deg, #f472b6 0%, #a78bfa 100%);
          color: white;
          box-shadow: 0 10px 30px rgba(236, 72, 153, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(236, 72, 153, 0.45);
        }

        .btn-secondary {
          background: white;
          color: #f472b6;
          border: 2px solid #f9a8d4;
        }

        .btn-secondary:hover {
          background: #fff0f5;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(249, 168, 212, 0.3);
        }

        .footer-text {
          margin-top: 40px;
          font-size: 13px;
          color: #888;
          animation: fadeInUp 1.2s ease;
        }

        @media (max-width: 576px) {
          .landing-title { font-size: 26px; }
          .landing-card { padding: 48px 28px; }
        }
      `}</style>

      <div className="landing-container">
        <div className="glow-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="landing-card">
          <div className="icon-wrapper">
            <Sparkles size={40} color="white" strokeWidth={2.5} />
          </div>

          <h1 className="landing-title">Organize your day beautifully ✨</h1>
          <p className="landing-subtitle">
            A minimalist, elegant task manager that helps you stay productive
            with a touch of magic — because your workflow deserves to be cute *and* classy.
          </p>

          <div className="btn-group">
            <a href="/login" className="btn btn-primary">
              Login
            </a>
            <a href="/register" className="btn btn-secondary">
              Sign Up
            </a>
          </div>

          <div className="footer-text">
            © {new Date().getFullYear()}  Task Manager 🌸
          </div>
        </div>
      </div>
    </>
  );
}
