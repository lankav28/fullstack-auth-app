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

  // ✅ Fetch tasks only when token and user are ready
  useEffect(() => {
    if (token && user) fetchTasks();
  }, [token, user, statusFilter, priorityFilter]);

  // 🔍 Debounce search (to avoid constant API calls)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (token && user) fetchTasks();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  // ✅ Proper fetch from /api/tasks
  const fetchTasks = async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      if (priorityFilter) params.append("priority", priorityFilter);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.status === 401) {
        setError("Session expired. Please login again.");
        setTasks([]);
        logout();
        return;
      }

      if (!res.ok) {
        setError(data?.message || "Failed to load tasks");
        setTasks([]);
        return;
      }

      // ✅ Backend returns { tasks: [...] }
      setTasks(data.tasks || []);
    } catch (e) {
      console.error("❌ Fetch error:", e);
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
      if (res.ok) fetchTasks();
      else console.error("Failed to delete task");
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
        body { background: linear-gradient(135deg, #fff7fb 0%, #ffe6f1 50%, #ffffff 100%); min-height: 100vh; }
        .modern-navbar { background: rgba(255,255,255,0.7)!important; backdrop-filter: blur(18px); border-bottom: 1px solid #ffd6e8; }
        .navbar-brand { background: linear-gradient(90deg,#ec4899,#a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight:700; }
        .modern-btn { border-radius: 12px; font-weight:600; padding:.55rem 1.4rem; border:2px solid transparent; transition:all .3s ease; }
        .modern-btn-primary { background:linear-gradient(135deg,#ec4899,#a78bfa); color:#fff; border:none; }
        .modern-btn-outline { background:transparent; color:#ec4899; border-color:#ec4899; }
        .filter-card { background:rgba(255,255,255,0.8); backdrop-filter:blur(15px); border:none; border-radius:20px; }
        .modern-input { border:2px solid #ffd6e8; border-radius:12px; padding:.75rem 1rem; }
        .stats-card { background:rgba(255,255,255,0.8); border-radius:20px; border:1px solid rgba(255,182,193,0.4); }
        .task-card { background:rgba(255,255,255,0.9); border-radius:22px; box-shadow:0 8px 24px rgba(236,72,153,0.12); transition:all .35s ease; }
        .task-card:hover { transform:translateY(-6px) scale(1.02); box-shadow:0 18px 45px rgba(236,72,153,0.25); }
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
              <button className="modern-btn modern-btn-outline" onClick={logout}>
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

          {/* Stats Summary */}
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="stats-card text-center p-4">
                <h5>✅ Completed</h5>
                <p className="stats-value">
                  {tasks.filter((t) => t.status === "completed").length}
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stats-card text-center p-4">
                <h5>🌷 In Progress</h5>
                <p className="stats-value">
                  {tasks.filter((t) => t.status === "in-progress").length}
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stats-card text-center p-4">
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

          {/* Tasks List */}
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
                        <p className="task-description mb-3">{task.description}</p>
                      )}
                      <div className="mt-auto">
                        <div className="d-flex gap-2 mb-3 flex-wrap">
                          <span className={`modern-badge badge-priority-${task.priority}`}>
                            {task.priority}
                          </span>
                          <span className={`modern-badge badge-status-${task.status}`}>
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
