import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./TaskModal.css";

const TaskModal = ({ task, onClose, onSuccess, token }) => {
  const { showToast } = useAuth();
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "pending");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.body.classList.add("modal-open");
    setTimeout(() => setIsVisible(true), 10);
    return () => document.body.classList.remove("modal-open");
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
      const url = task
        ? `http://localhost:5000/api/tasks/${task._id}`
        : "http://localhost:5000/api/tasks";
      const method = task ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status, priority }),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess();
        setTimeout(handleClose, 800);
        showToast(
          task ? "✅ Task updated successfully!" : "✅ Task created successfully!",
          "success"
        );
      } else {
        setError(data.message || "Failed to save task");
        showToast("❌ Failed to save task", "error");
      }
    } catch {
      setError("Network error. Please try again.");
      showToast("⚠️ Network error, please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`task-modal-backdrop ${isVisible ? "show" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`task-modal-dialog ${isVisible ? "show" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="task-modal-content">
          <div className="task-modal-header">
            <div className="header-content">
              <div
                className="header-icon"
                style={{
                  background: task
                    ? "linear-gradient(135deg, #fbcfe8 0%, #f472b6 100%)"
                    : "linear-gradient(135deg, #f9a8d4 0%, #f472b6 100%)",
                }}
              >
                {task ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                )}
              </div>
              <div>
                <h5 className="modal-title">
                  {task ? "Edit Task" : "Create New Task"}
                </h5>
                <p className="modal-subtitle">
                  {task ? "Update your lovely task ✏️" : "Add a new task 🌸"}
                </p>
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

          <div className="task-modal-body">
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
                  Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={3}
                  className="modern-input"
                  placeholder="Enter task title"
                />
              </div>

              <div className="modern-form-group">
                <label className="modern-label">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="modern-textarea"
                  placeholder="Describe your task..."
                />
              </div>

              <div className="form-row">
                <div className="modern-form-group">
                  <label className="modern-label">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="modern-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="modern-form-group">
                  <label className="modern-label">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="modern-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="task-modal-footer">
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
                      <span>{task ? "Update Task" : "Create Task"}</span>
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

export default TaskModal;
