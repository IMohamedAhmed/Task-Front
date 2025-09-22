import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setDetailsLoading] = useState(false);

  const drawerTopOffset = 64;
  const didFetch = useRef(false);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

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
      const res = await api.post("/projects", {
        name,
        description,
        deadline: date || null,
      });
      setProjects((prev) => [...prev, res.data.data]);
      setName("");
      setDescription("");
      setDate("");
      setTimeout(() => setOpenModal(false), 300);
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

  return (
    <div className="h-screen flex overflow-hidden text-white bg-gradient-to-br from-dark-950 via-secondary-900 to-neutral-900">
      {/* Sidebar */}
      <div
        className="w-80 flex-shrink-0 bg-neutral-900/90 border-r border-neutral-700/50 p-4 overflow-y-auto"
        style={{
          marginTop: `${drawerTopOffset}px`,
          height: `calc(100vh - ${drawerTopOffset}px)`,
        }}
      >
        <h2 className="text-xl font-bold mb-4">My Projects</h2>

        {loading ? (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
          </div>
        ) : projects.length === 0 ? (
          <p className="text-neutral-400 mt-2 text-sm">No projects yet</p>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => {
              const isSelected =
                selectedProject && selectedProject._id === project._id;
              return (
                <button
                  key={project._id}
                  onClick={() => handleSelectProject(project._id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-250 border-l-4 ${
                    isSelected
                      ? "bg-white/15 border-l-primary-600 pl-2"
                      : "bg-transparent border-l-transparent hover:bg-white/10 hover:translate-x-1"
                  }`}
                >
                  <div className="font-medium text-white">
                    {project.name || "Untitled Project"}
                  </div>
                  {project.deadline && (
                    <div className="text-sm text-neutral-400 mt-1">
                      Due:{" "}
                      {new Date(project.deadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        className="flex-1 ml-5 flex flex-col overflow-hidden"
        style={{ marginTop: `${drawerTopOffset}px` }}
      >
        {!selectedProject ? (
          <div className="flex-1 flex items-center justify-center flex-col text-center">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Your Project Dashboard
            </h1>
            <p className="text-neutral-400 max-w-lg">
              Select a project from the left or click the "+" button to create a
              new one.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 bg-neutral-800/90 border border-neutral-700/50 rounded-xl shadow-2xl mr-6 mt-6 mb-20">
            <h1 className="text-4xl font-bold mb-2">{selectedProject.name}</h1>
            <p className="text-neutral-400 mb-4">
              Created:{" "}
              {new Date(selectedProject.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <hr className="border-white/10 mb-4" />

            <p className="mb-4">
              {selectedProject.description || "No description provided."}
            </p>

            {selectedProject.deadline && (
              <p className="mb-6">
                Deadline:{" "}
                {new Date(selectedProject.deadline).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </p>
            )}

            <h2 className="text-2xl font-bold mt-6 mb-4">
              Tasks ({selectedProject._tasks?.length || 0})
            </h2>

            {!selectedProject._tasks || selectedProject._tasks.length === 0 ? (
              <p className="text-neutral-400">No tasks available.</p>
            ) : (
              <div className="space-y-4">
                {selectedProject._tasks.map((task) => {
                  const priorityColors = {
                    high: "border-l-danger-500",
                    medium: "border-l-warning-500",
                    low: "border-l-success-500",
                  };
                  const priorityTextColors = {
                    high: "text-danger-400",
                    medium: "text-warning-400",
                    low: "text-success-400",
                  };

                  return (
                    <div
                      key={task._id}
                      className={`p-4 rounded-lg bg-white/5 border-l-4 transition-transform duration-200 hover:translate-x-1 ${
                        priorityColors[task.priority] || priorityColors.low
                      }`}
                    >
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      <p className="text-neutral-400 text-sm mb-2">
                        {task.description || "No description"}
                      </p>
                      <span
                        className={`text-xs font-medium capitalize ${
                          priorityTextColors[task.priority] ||
                          priorityTextColors.low
                        }`}
                      >
                        {task.status} • {task.priority} priority
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Button */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-2xl font-bold"
        onClick={() => setOpenModal(true)}
      >
        +
      </button>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <form
            onSubmit={handleAddProject}
            className="bg-neutral-800/95 backdrop-blur-md text-white border border-neutral-700/50 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl"
          >
            <h2 className="text-xl font-semibold mb-4">Create New Project</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Project Name"
                className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-lg placeholder-white/70 focus:outline-none focus:border-primary-500 transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <textarea
                placeholder="Description"
                rows={3}
                className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-lg placeholder-white/70 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="date"
                className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="flex-1 py-3 bg-neutral-600 hover:bg-neutral-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Add Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
