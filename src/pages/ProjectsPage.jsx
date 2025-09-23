import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";

export default React.memo(function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setDetailsLoading] = useState(false);

  // Task states
  const [tasks, setTasks] = useState([]);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskStatus, setTaskStatus] = useState("pending");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskVideoLink, setTaskVideoLink] = useState("");
  const [tasksLoading, setTasksLoading] = useState(false);
  const [expandedVideo, setExpandedVideo] = useState(null);

  const drawerTopOffset = 64;
  const didFetch = useRef(false);

  const api = useMemo(
    () =>
      axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
    []
  );

  useEffect(() => {
    // Lock scrollbar
    document.body.style.overflow = "hidden";

    if (!didFetch.current) {
      didFetch.current = true;
      const fetchProjects = async () => {
        setLoading(true);
        try {
          const res = await api.get("/projects");
          setProjects(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProjects();
    }

    // Cleanup: re-enable scrolling on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [api]);

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/project", {
        name,
        description,
        deadline: date || null,
      });
      setProjects((prev) => [...prev, res.data.data]);
      setName("");
      setDescription("");
      setDate("");
      setOpenModal(false);
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project");
    }
  };

  const handleSelectProject = async (projectId) => {
    // If clicking the same project again, deselect
    if (selectedProject && selectedProject._id === projectId) {
      setSelectedProject(null);
      return;
    }

    setDetailsLoading(true);
    try {
      const res = await api.get(`/project/${projectId}`);
      setSelectedProject(res.data.data);
    } catch (error) {
      console.error("Error fetching project details:", error);
      alert("Could not load project details");
    } finally {
      setDetailsLoading(false);
    }
  };

  // Task functions
  const fetchTasks = useCallback(async () => {
    if (!selectedProject?._id) return;

    setTasksLoading(true);
    try {
      const res = await api.get("/tasks", {
        params: { projectId: selectedProject._id },
      });
      setTasks(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  }, [selectedProject?._id, api]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!selectedProject?._id) return;

    try {
      const taskData = {
        title: taskTitle,
        description: taskDescription,
        status: taskStatus,
        priority: taskPriority,
      };

      if (taskDueDate) {
        taskData.dueDate = taskDueDate;
      }

      if (taskVideoLink) {
        taskData.videoLink = taskVideoLink;
      }

      const res = await api.post("/task", taskData, {
        params: {
          projectId: selectedProject._id,
        },
      });
      setTasks((prev) => [...prev, res.data.data]);
      // Clear form
      setTaskTitle("");
      setTaskDescription("");
      setTaskDueDate("");
      setTaskStatus("pending");
      setTaskPriority("medium");
      setTaskVideoLink("");
      setOpenTaskModal(false);
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!selectedProject?._id) return;
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/task/${taskId}`, {
        params: {
          projectId: selectedProject._id,
        },
      });
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    if (!selectedProject?._id) return;

    try {
      await api.patch(`/task/${taskId}/status`, {
        status: newStatus,
        projectId: selectedProject._id,
      });
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status");
    }
  };

  // Helper function to convert video URLs to embeddable iframe URLs
  const getEmbedUrl = (url) => {
    if (!url) return null;

    // YouTube URL patterns
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo URL patterns
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Return original URL if it's already an embed URL or other supported format
    return url;
  };

  // Helper function to get priority styling
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return {
          border: "border-l-red-500",
          bg: "bg-red-500/10",
          text: "text-red-400",
          icon: "🔥",
        };
      case "medium":
        return {
          border: "border-l-yellow-500",
          bg: "bg-yellow-500/10",
          text: "text-yellow-400",
          icon: "⚡",
        };
      case "low":
        return {
          border: "border-l-green-500",
          bg: "bg-green-500/10",
          text: "text-green-400",
          icon: "🌱",
        };
      default:
        return {
          border: "border-l-accent-500",
          bg: "bg-accent-500/10",
          text: "text-accent-400",
          icon: "📝",
        };
    }
  };

  // Helper function to get status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return { bg: "bg-green-500/20", text: "text-green-400", icon: "✅" };
      case "in-progress":
        return { bg: "bg-blue-500/20", text: "text-blue-400", icon: "🔄" };
      case "archived":
        return { bg: "bg-gray-500/20", text: "text-gray-400", icon: "📦" };
      default: // pending
        return { bg: "bg-yellow-500/20", text: "text-yellow-400", icon: "⏳" };
    }
  };

  // Fetch tasks when a project is selected
  useEffect(() => {
    if (selectedProject?._id) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [selectedProject?._id, fetchTasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-secondary-950 to-dark-950 relative overflow-hidden">
      {/* Background Elements - Simplified */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/5 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-600/5 rounded-full"></div>
      </div>

      <div className="relative z-10 h-screen flex overflow-hidden text-white">
        {/* Sidebar */}
        <div
          className="w-80 flex-shrink-0 glass border-r border-neutral-700/30 p-6 overflow-y-auto"
          style={{
            marginTop: `${drawerTopOffset}px`,
            height: `calc(100vh - ${drawerTopOffset}px)`,
          }}
        >
          <div className="flex items-center gap-3 mb-8 mt-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
              <span className="text-sm font-bold text-white">📊</span>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
              My Projects
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center mt-8">
              <div className="relative">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600/30 border-t-primary-600"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 border border-primary-600/20"></div>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-600/20 to-accent-600/20 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-neutral-400 text-sm">No projects yet</p>
              <p className="text-neutral-500 text-xs mt-1">
                Create your first project to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => {
                const isSelected =
                  selectedProject && selectedProject._id === project._id;
                return (
                  <button
                    key={project._id}
                    onClick={() => handleSelectProject(project._id)}
                    className={`w-full text-left p-4 rounded-xl transition-colors duration-200 border ${
                      isSelected
                        ? "glass-light border-primary-600/50 bg-gradient-to-r from-primary-600/10 to-accent-600/10"
                        : "glass-light border-neutral-700/30 hover:border-primary-600/30 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-white">
                          {project.name || "Untitled Project"}
                        </div>
                        {project.deadline && (
                          <div className="text-sm text-neutral-400 mt-1 flex items-center gap-1">
                            <span className="text-xs">📅</span>
                            Due:{" "}
                            {new Date(project.deadline).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div
          className="flex-1 ml-6 flex flex-col overflow-hidden"
          style={{ marginTop: `${drawerTopOffset + 24}px` }}
        >
          {!selectedProject ? (
            <div className="flex-1 flex items-center justify-center flex-col text-center p-8">
              <div className="animate-slide-up">
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary-600/20 to-accent-600/20 flex items-center justify-center">
                  <span className="text-4xl">🚀</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-500 bg-clip-text text-transparent">
                  Project Dashboard
                </h1>
                <p className="text-neutral-400 max-w-lg text-lg leading-relaxed">
                  Select a project from the left sidebar or create a new one to
                  get started with your productivity journey.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-8 glass-light border border-neutral-700/30 rounded-2xl shadow-2xl mr-6 mt-6 mb-20">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-primary-300 bg-clip-text text-transparent">
                    {selectedProject.name}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-neutral-400">
                    <span className="flex items-center gap-1">
                      <span className="text-xs">📅</span>
                      Created:{" "}
                      {new Date(selectedProject.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                    {selectedProject.deadline && (
                      <span className="flex items-center gap-1">
                        <span className="text-xs">⏰</span>
                        Due:{" "}
                        {new Date(selectedProject.deadline).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-neutral-600/50 to-transparent mb-6"></div>

              {selectedProject.description && (
                <div className="glass-light p-4 rounded-xl mb-6 border border-neutral-700/30">
                  <p className="text-neutral-300 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-600 to-primary-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">✓</span>
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">
                    Tasks ({tasksLoading ? "..." : tasks.length})
                  </h2>
                </div>
                <button
                  onClick={() => setOpenTaskModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-600 to-primary-600 hover:from-accent-500 hover:to-primary-500 text-white font-semibold rounded-xl transition-colors duration-200"
                >
                  <span className="text-lg">+</span>
                  <span>Add Task</span>
                </button>
              </div>

              {tasksLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400 mx-auto mb-4"></div>
                  <p className="text-neutral-400">Loading tasks...</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-600/20 to-primary-600/20 flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                  <p className="text-neutral-400">No tasks available yet.</p>
                  <p className="text-neutral-500 text-sm mt-1">
                    Add some tasks to start tracking your progress
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {tasks.map((task) => {
                    const priorityStyle = getPriorityStyle(task.priority);
                    const statusStyle = getStatusStyle(task.status);
                    const embedUrl = getEmbedUrl(task.videoLink);

                    return (
                      <div
                        key={task._id}
                        className={`glass-light p-6 rounded-xl border-l-4 transition-all duration-200 hover:bg-white/5 hover:shadow-lg ${priorityStyle.border} ${priorityStyle.bg}`}
                      >
                        {/* Header Section */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                              {task.title}
                            </h3>
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="flex items-center gap-1">
                                <span className="text-sm">
                                  {statusStyle.icon}
                                </span>
                                <span
                                  className={`text-xs font-medium capitalize px-2 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}
                                >
                                  {task.status.replace("-", " ")}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-sm">
                                  {priorityStyle.icon}
                                </span>
                                <span
                                  className={`text-xs font-medium capitalize px-2 py-1 rounded-full ${priorityStyle.bg} ${priorityStyle.text}`}
                                >
                                  {task.priority}
                                </span>
                              </div>
                              {task.dueDate && (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs">📅</span>
                                  <span className="text-xs text-neutral-400">
                                    Due:{" "}
                                    {new Date(
                                      task.dueDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions Dropdown */}
                          <div className="relative group ml-4">
                            <button className="text-neutral-400 hover:text-white transition-colors p-2 hover:bg-neutral-700/50 rounded-lg">
                              <span className="text-lg">⋮</span>
                            </button>
                            <div className="absolute right-0 top-10 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 min-w-44">
                              <div className="py-1">
                                <div className="px-3 py-2 text-xs font-medium text-neutral-400 border-b border-neutral-700">
                                  Change Status
                                </div>
                                {[
                                  "pending",
                                  "in-progress",
                                  "completed",
                                  "archived",
                                ].map((status) => (
                                  <button
                                    key={status}
                                    onClick={() =>
                                      handleUpdateTaskStatus(task._id, status)
                                    }
                                    className={`block w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 transition-colors ${
                                      task.status === status
                                        ? "text-accent-400"
                                        : "text-neutral-300"
                                    }`}
                                  >
                                    {status
                                      .replace("-", " ")
                                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                                    {task.status === status && (
                                      <span className="ml-2">✓</span>
                                    )}
                                  </button>
                                ))}
                                <div className="border-t border-neutral-700 mt-1 pt-1">
                                  <button
                                    onClick={() => handleDeleteTask(task._id)}
                                    className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                  >
                                    🗑️ Delete Task
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        {(task.description || embedUrl) && (
                          <div className="mb-4">
                            <div className="flex gap-4">
                              <div className="flex-1">
                                {task.description && (
                                  <div className="bg-neutral-800/30 rounded-lg p-3 border border-neutral-700/20">
                                    <p className="text-neutral-300 text-sm leading-relaxed">
                                      {task.description}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {embedUrl && (
                                <div className="flex-shrink-0">
                                  <button
                                    onClick={() => setExpandedVideo(task._id)}
                                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-accent-600/20 to-primary-600/20 hover:from-accent-600/30 hover:to-primary-600/30 border border-accent-500/30 rounded-lg transition-all duration-200 hover:scale-105 text-accent-400 hover:text-accent-300"
                                  >
                                    <span className="text-lg">📹</span>
                                    <span className="text-sm font-medium">
                                      Watch Video
                                    </span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Footer Section */}
                        <div className="flex items-center justify-between pt-3 border-t border-neutral-700/20">
                          <div className="flex items-center gap-1">
                            <span className="text-xs">🕒</span>
                            <span className="text-xs text-neutral-500">
                              {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {task.videoLink && !embedUrl && (
                              <a
                                href={task.videoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-accent-400 hover:text-accent-300 transition-colors px-2 py-1 rounded-full hover:bg-accent-500/10"
                              >
                                🔗 Video Link
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Button */}
      <button
        className="fixed bottom-2 right-8 w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white rounded-2xl shadow-lg transition-colors duration-200 flex items-center justify-center text-2xl font-bold z-40"
        onClick={() => setOpenModal(true)}
      >
        <span className="relative z-10">+</span>
      </button>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-accent-600/10 rounded-2xl"></div>
            <form
              onSubmit={handleAddProject}
              className="relative glass border border-neutral-700/50 rounded-2xl p-8 w-full max-w-4xl mx-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                  <span className="text-white font-bold">+</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                  Create New Project
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-3">
                      Project Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter project name..."
                      className="w-full p-5 glass-light text-white border border-neutral-700/30 rounded-xl placeholder-neutral-400 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-3">
                      Deadline (Optional)
                    </label>
                    <input
                      type="date"
                      className="w-full p-5 glass-light text-white border border-neutral-700/30 rounded-xl focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe your project..."
                    rows={4}
                    className="w-full p-5 glass-light text-white border border-neutral-700/30 rounded-xl placeholder-neutral-400 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="group flex-1 py-3 px-6 glass-light border border-neutral-600/50 hover:border-neutral-500 text-neutral-300 hover:text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-lg relative overflow-hidden"
                >
                  <span className="relative z-10">Cancel</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-700/30 to-neutral-600/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button
                  type="submit"
                  className="group flex-1 py-3 px-6 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25 relative overflow-hidden"
                >
                  <span className="relative z-10">Create Project</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {openTaskModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="relative">
            <form
              onSubmit={handleAddTask}
              className="relative bg-neutral-900 border border-neutral-700/50 rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-600 to-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">
                  Create New Task
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-3">
                      Task Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter task title..."
                      className="w-full p-5 glass-light text-white border border-neutral-700/30 rounded-xl placeholder-neutral-400 focus:outline-none focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20 transition-colors duration-200"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-3">
                      Due Date (Optional)
                    </label>
                    <input
                      type="date"
                      className="w-full p-5 glass-light text-white border border-neutral-700/30 rounded-xl focus:outline-none focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20 transition-colors duration-200"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-3">
                      Status
                    </label>
                    <select
                      className="w-full p-5 glass-light text-white border border-neutral-700/30 rounded-xl focus:outline-none focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20 transition-colors duration-200 [&>option]:bg-neutral-800 [&>option]:text-white"
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value)}
                    >
                      <option
                        value="pending"
                        className="bg-neutral-800 text-white"
                      >
                        Pending
                      </option>
                      <option
                        value="in-progress"
                        className="bg-neutral-800 text-white"
                      >
                        In Progress
                      </option>
                      <option
                        value="completed"
                        className="bg-neutral-800 text-white"
                      >
                        Completed
                      </option>
                      <option
                        value="archived"
                        className="bg-neutral-800 text-white"
                      >
                        Archived
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-3">
                      Priority
                    </label>
                    <select
                      className="w-full p-5 glass-light text-white border border-neutral-700/30 rounded-xl focus:outline-none focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20 transition-colors duration-200 [&>option]:bg-neutral-800 [&>option]:text-white"
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value)}
                    >
                      <option value="low" className="bg-neutral-800 text-white">
                        Low
                      </option>
                      <option
                        value="medium"
                        className="bg-neutral-800 text-white"
                      >
                        Medium
                      </option>
                      <option
                        value="high"
                        className="bg-neutral-800 text-white"
                      >
                        High
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe this task..."
                    rows={3}
                    className="w-full p-5 glass-light text-white border border-neutral-700/30 rounded-xl placeholder-neutral-400 focus:outline-none focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20 transition-colors duration-200 resize-none"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">
                    Video Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="Enter video URL (YouTube, Vimeo, etc.)..."
                    className="w-full p-5 glass-light text-white border border-neutral-700/30 rounded-xl placeholder-neutral-400 focus:outline-none focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20 transition-colors duration-200"
                    value={taskVideoLink}
                    onChange={(e) => setTaskVideoLink(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setOpenTaskModal(false)}
                  className="group flex-1 py-3 px-6 glass-light border border-neutral-600/50 hover:border-neutral-500 text-neutral-300 hover:text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-lg relative overflow-hidden"
                >
                  <span className="relative z-10">Cancel</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-700/30 to-neutral-600/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button
                  type="submit"
                  className="group flex-1 py-3 px-6 bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-500 hover:to-accent-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent-500/25 relative overflow-hidden"
                >
                  <span className="relative z-10">Create Task</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expanded Video Modal */}
      {expandedVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-[95vw] mx-2">
            <button
              onClick={() => setExpandedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-neutral-300 text-3xl"
            >
              ✕
            </button>
            <div className="relative bg-black rounded-xl overflow-hidden">
              <iframe
                src={getEmbedUrl(
                  tasks.find((t) => t._id === expandedVideo)?.videoLink
                )}
                title="Expanded Video"
                className="w-full h-[90vh]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
