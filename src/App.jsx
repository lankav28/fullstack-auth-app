import React from "react";
import Landing from "./pages/Landing.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "animate.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; 


// 🌸 Soft pink Loading Screen
const LoadingScreen = () => (
  <div
    className="d-flex vh-100 justify-content-center align-items-center"
    style={{
      background:
        "linear-gradient(180deg, #fff7fb 0%, #ffe6f1 50%, #ffffff 100%)",
    }}
  >
    <div className="text-center">
      <div
        className="spinner-border"
        role="status"
        style={{
          width: "3rem",
          height: "3rem",
          color: "#ec4899",
        }}
      ></div>
      <p className="mt-3 text-secondary fw-semibold">
        Loading your  dashboard...
      </p>
    </div>
  </div>
);

// 🔒 Protected route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" replace />;
};

// 🌸 Public route
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// 💫 Animated route transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        timeout={400}
        classNames="fade-slide"
        unmountOnExit
      >
        <Routes location={location}>
          <Route path="/" element={<Landing />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <AnimatedRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
