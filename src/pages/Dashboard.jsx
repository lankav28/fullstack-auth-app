import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import TaskModal from "../components/TaskModal";
import ProfileModal from "../components/ProfileModal";

export default function Dashboard() {
  const { user, token, logout, fetchProfile } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter, priorityFilter, token]);

  const fetchTasks = async () => {
  if (!token) return;
  setLoading(true);
  setError("");
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (statusFilter) params.append("status", statusFilter);
    if (priorityFilter) params.append("priority", priorityFilter);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data?.message || "Failed to load tasks");
      setTasks([]);
      return;
    }

    setTasks(Array.isArray(data) ? data : data.tasks || []);
  } catch (e) {
    console.error(e);
    setError("⚠️ Network error. Please check your connection.");
    setTasks([]);
  } finally {
    setLoading(false);
  }
};

  const handleDeleteTask = async (id) => {
  if (!window.confirm("Are you sure you want to delete this task?")) return;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      fetchTasks();
    } else {
      console.error("Failed to delete task");
    }
  } catch (e) {
    console.error("Delete error:", e);
  }
};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; }

        @keyframes fadeInUp { from {opacity:0; transform:translateY(25px);} to {opacity:1; transform:none;} }
        @keyframes scaleIn { from {opacity:0; transform:scale(0.92);} to {opacity:1; transform:scale(1);} }
        @keyframes gradientMove {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        body {
          background: linear-gradient(135deg, #fff7fb 0%, #ffe6f1 50%, #ffffff 100%);
          background-size: 200% 200%;
          animation: gradientMove 10s ease infinite;
          min-height: 100vh;
        }

        /* 🌸 Navbar */
        .modern-navbar {
          background: rgba(255,255,255,0.7)!important;
          -webkit-backdrop-filter: blur(18px);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid #ffd6e8;
          box-shadow: 0 8px 24px rgba(236,72,153,0.1);
          animation: fadeInUp .6s ease-out;
        }
        .modern-navbar .navbar-brand {
          background: linear-gradient(90deg,#ec4899,#a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight:700;
          letter-spacing:-0.5px;
        }

        .user-greeting {
          color:#444; 
          font-weight:600;
        }

        /* Buttons */
        .modern-btn {
          border-radius: 12px;
          font-weight:600;
          padding:.55rem 1.4rem;
          border:2px solid transparent;
          transition:all .3s ease;
        }
        .modern-btn-primary {
          background:linear-gradient(135deg,#ec4899,#a78bfa);
          color:#fff;
          border:none;
        }
        .modern-btn-primary:hover {
          transform:translateY(-2px);
          box-shadow:0 10px 25px rgba(236,72,153,0.35);
        }
        .modern-btn-outline {
          background:transparent;
          color:#ec4899;
          border-color:#ec4899;
        }
        .modern-btn-outline:hover {
          background:#ec4899;
          color:#fff;
          transform:translateY(-2px);
          box-shadow:0 8px 22px rgba(236,72,153,0.3);
        }

        /* Filter card */
        .filter-card {
          background:rgba(255,255,255,0.8);
          -webkit-backdrop-filter:blur(15px);
          backdrop-filter:blur(15px);
          border:none;
          border-radius:20px;
          box-shadow:0 10px 35px rgba(236,72,153,0.1);
          animation:fadeInUp .6s ease-out .1s both;
        }

        .modern-input {
          border:2px solid #ffd6e8;
          border-radius:12px;
          padding:.75rem 1rem;
          transition:all .3s ease;
          background:#fff;
        }
        .modern-input:focus {
          border-color:#ec4899;
          box-shadow:0 0 0 4px rgba(236,72,153,0.15);
          outline:none;
        }

        /* 🌸 Stats Cards */
        .stats-card {
          background: rgba(255,255,255,0.8);
          -webkit-backdrop-filter: blur(15px);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          border: 1px solid rgba(255,182,193,0.4);
          box-shadow: 0 10px 30px rgba(236,72,153,0.1);
          transition: all 0.35s ease;
          animation: fadeInUp 0.6s ease both;
        }
        .stats-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 12px 40px rgba(236,72,153,0.2);
        }
        .stats-card h5 {
          font-weight: 600;
          color: #9d174d;
          margin-bottom: 0.5rem;
        }
        .stats-value {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(90deg,#ec4899,#a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .stats-completed {
          background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
        }
        .stats-progress {
          background: linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%);
        }
        .stats-pending {
          background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
        }

        /* Task cards */
        .task-card {
          background:rgba(255,255,255,0.9);
          -webkit-backdrop-filter:blur(12px);
          backdrop-filter:blur(12px);
          border:none;
          border-radius:22px;
          animation:scaleIn .5s ease-out both;
          transition:all .35s ease;
          box-shadow:0 8px 24px rgba(236,72,153,0.12);
          position:relative;
          overflow:hidden;
        }

        .task-card::before {
          content:'';
          position:absolute;
          top:0; left:-100%;
          width:100%; height:4px;
          background:linear-gradient(90deg,#f9a8d4,#a78bfa,#ec4899);
          animation: shimmer 5s infinite linear;
        }

        @keyframes shimmer {
          0% { left:-100%; }
          100% { left:100%; }
        }

        .task-card:hover {
          transform:translateY(-6px) scale(1.02);
          box-shadow:0 18px 45px rgba(236,72,153,0.25);
        }

        .task-title {
          background:linear-gradient(90deg,#ec4899,#a78bfa);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          font-weight:700;
          font-size:1.2rem;
          margin-bottom:.5rem;
        }
        .task-description {
          color:#555;
          font-size:.95rem;
        }

        /* Badges */
        .modern-badge {
          padding:.4rem .9rem;
          border-radius:10px;
          font-weight:600;
          font-size:.75rem;
          text-transform:uppercase;
          letter-spacing:.5px;
        }
        .badge-priority-high {
          background:linear-gradient(90deg,#f472b6,#ec4899);
          color:#fff;
        }
        .badge-priority-medium {
          background:linear-gradient(90deg,#fbcfe8,#f9a8d4);
          color:#6b214b;
        }
        .badge-priority-low {
          background:linear-gradient(90deg,#fce7f3,#fff);
          color:#333;
        }
        .badge-status-pending {
          background:#fff1f7;
          color:#6b214b;
        }
        .badge-status-in-progress {
          background:#fde2f3;
          color:#9d174d;
        }
        .badge-status-completed {
          background:#a7f3d0;
          color:#065f46;
        }

        /* Task action buttons */
        .action-btn {
          border-radius:10px;
          padding:.4rem .9rem;
          font-weight:600;
          font-size:.85rem;
          border:2px solid transparent;
          transition:all .3s ease;
        }
        .action-btn-edit {
          color:#ec4899;
          border-color:#ec4899;
        }
        .action-btn-edit:hover {
          background:#ec4899;
          color:#fff;
          transform:translateY(-2px);
          box-shadow:0 5px 15px rgba(236,72,153,0.3);
        }
        .action-btn-delete {
          color:#f5576c;
          border-color:#f5576c;
        }
        .action-btn-delete:hover {
          background:#f5576c;
          color:#fff;
          transform:translateY(-2px);
          box-shadow:0 5px 15px rgba(245,87,108,0.3);
        }

        .error-alert {
          border-radius:16px;
          background:rgba(245,87,108,0.08);
          color:#f5576c;
          font-weight:600;
          border:none;
        }
        .empty-state {
          color:#ec4899;
          font-weight:500;
          font-size:1.25rem;
          animation:fadeInUp .6s ease;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#fff7fb 0%,#ffe6f1 50%,#ffffff 100%)",
        }}
      >
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg modern-navbar shadow-sm">
          <div className="container-fluid px-4">
            <span className="navbar-brand">💗 Task Manager</span>
            <div className="d-flex align-items-center gap-3">
              <span className="user-greeting d-none d-md-inline">
                Hello, {user?.name || "User"} 🌸
              </span>
              <button
                className="modern-btn modern-btn-outline"
                onClick={() => setShowProfileModal(true)}
              >
                Profile
              </button>
              <button
                className="modern-btn modern-btn-outline"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="container py-5">
          {/* Filters */}
          <div className="card filter-card mb-4">
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control modern-input"
                    placeholder="🔍 Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select modern-input"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select modern-input"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 🌸 Stats Summary */}
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="stats-card stats-completed text-center p-4">
                <h5>✅ Completed</h5>
                <p className="stats-value">
                  {tasks.filter((t) => t.status === "completed").length}
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stats-card stats-progress text-center p-4">
                <h5>🌷 In Progress</h5>
                <p className="stats-value">
                  {tasks.filter((t) => t.status === "in-progress").length}
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stats-card stats-pending text-center p-4">
                <h5>🌼 Pending</h5>
                <p className="stats-value">
                  {tasks.filter((t) => t.status === "pending").length}
                </p>
              </div>
            </div>
          </div>

          {/* Add Task */}
          <div className="text-end mb-4">
            <button
              onClick={() => {
                setEditingTask(null);
                setShowTaskModal(true);
              }}
              className="modern-btn modern-btn-primary px-4 py-2"
            >
              ➕ Add New Task
            </button>
          </div>

          {/* Tasks */}
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                role="status"
                style={{ color: "#ec4899", width: "3rem", height: "3rem" }}
              ></div>
              <p className="mt-3 text-secondary fw-semibold">
                Loading your tasks...
              </p>
            </div>
          ) : error ? (
            <div className="alert error-alert">{error}</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-5 empty-state">
              No tasks yet — start something lovely 💫
            </div>
          ) : (
            <div className="row g-4">
              {tasks.map((task) => (
                <div key={task._id} className="col-md-6 col-lg-4">
                  <div className="card task-card h-100">
                    <div className="card-body p-4 d-flex flex-column">
                      <h5 className="task-title">{task.title}</h5>
                      {task.description && (
                        <p className="task-description mb-3">
                          {task.description}
                        </p>
                      )}
                      <div className="mt-auto">
                        <div className="d-flex gap-2 mb-3 flex-wrap">
                          <span
                            className={`modern-badge badge-priority-${task.priority}`}
                          >
                            {task.priority}
                          </span>
                          <span
                            className={`modern-badge badge-status-${task.status}`}
                          >
                            {task.status.replace("-", " ")}
                          </span>
                        </div>
                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            className="action-btn action-btn-edit"
                            onClick={() => {
                              setEditingTask(task);
                              setShowTaskModal(true);
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="action-btn action-btn-delete"
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        {showTaskModal && (
          <TaskModal
            task={editingTask}
            onClose={() => {
              setShowTaskModal(false);
              setEditingTask(null);
            }}
            onSuccess={fetchTasks}
            token={token}
          />
        )}
        {showProfileModal && (
          <ProfileModal
            onClose={() => setShowProfileModal(false)}
            onSuccess={fetchProfile}
            token={token}
            user={user}
          />
        )}
      </div>
    </>
  );
}
