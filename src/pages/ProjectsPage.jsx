import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Drawer,
  Fab,
  Modal,
  CircularProgress,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setDetailsLoading] = useState(false);

  const drawerWidth = 300;
  const drawerTopOffset = 64;
  const didFetch = useRef(false);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const commonInputStyles = {
    "& .MuiInputLabel-root": { color: "#ccc" },
    "& .MuiInputBase-input": { color: "#fff" },
  };

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
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2500&auto=format&fit=crop')",
        backgroundSize: "cover",
        gap: 0,
        backgroundPosition: "center",
        color: "#fff",
        overflow: "hidden", // make absolutely sure Box itself doesn't overflow
      }}
    >
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "rgba(0,0,0,0.85)",
            color: "#fff",
            p: 2,
            top: `${drawerTopOffset}px`,
            height: `calc(100% - ${drawerTopOffset}px)`,
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          My Projects
        </Typography>

        {loading ? (
          <CircularProgress size={28} sx={{ color: "#fff", mt: 2 }} />
        ) : projects.length === 0 ? (
          <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
            No projects yet
          </Typography>
        ) : (
          <List>
            {projects.map((project) => {
              const isSelected =
                selectedProject && selectedProject._id === project._id;
              return (
                <ListItemButton
                  key={project._id}
                  onClick={() => handleSelectProject(project._id)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    transition: "all 0.25s ease",
                    bgcolor: isSelected
                      ? "rgba(255,255,255,0.15)"
                      : "transparent",
                    borderLeft: isSelected
                      ? "4px solid #4f46e5"
                      : "4px solid transparent",
                    pl: isSelected ? 1 : 0,
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemText
                    primary={project.name || "Untitled Project"}
                    secondary={
                      project.deadline
                        ? `Due: ${new Date(project.deadline).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}`
                        : ""
                    }
                    sx={{
                      "& .MuiListItemText-primary": {
                        color: "#fff",
                        fontWeight: 500,
                      },
                      "& .MuiListItemText-secondary": { color: "gray" },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        )}
      </Drawer>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          ml: `20px`,
          mt: `${drawerTopOffset}px`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {!selectedProject ? (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
              Welcome to Your Project Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: "gray", maxWidth: 500 }}>
              Select a project from the left or click the "+" button to create a
              new one.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 4,
              bgcolor: "rgba(30,30,30,0.95)",
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              mr: 3,
              mt: 3,
              mb: 10,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              {selectedProject.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>
              Created:{" "}
              {new Date(selectedProject.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>
            <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mb: 2 }} />

            <Typography variant="body1" sx={{ mb: 2 }}>
              {selectedProject.description || "No description provided."}
            </Typography>

            {selectedProject.deadline && (
              <Typography variant="body1" sx={{ mb: 3 }}>
                Deadline:{" "}
                {new Date(selectedProject.deadline).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </Typography>
            )}

            <Typography variant="h5" sx={{ mt: 3, mb: 2, fontWeight: "bold" }}>
              Tasks ({selectedProject._tasks?.length || 0})
            </Typography>

            {!selectedProject._tasks || selectedProject._tasks.length === 0 ? (
              <Typography variant="body2" sx={{ color: "gray" }}>
                No tasks available.
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {selectedProject._tasks.map((task) => {
                  const priorityColor =
                    task.priority === "high"
                      ? "#ef4444"
                      : task.priority === "medium"
                      ? "#f59e0b"
                      : "#10b981";

                  return (
                    <Box
                      key={task._id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(255,255,255,0.07)",
                        borderLeft: `4px solid ${priorityColor}`,
                        transition: "transform 0.2s ease",
                        "&:hover": { transform: "translateX(4px)" },
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {task.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "gray", mb: 0.5 }}
                      >
                        {task.description || "No description"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: priorityColor,
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      >
                        {task.status} • {task.priority} priority
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Floating Button */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          bgcolor: "#4f46e5",
          "&:hover": { bgcolor: "#3730a3" },
        }}
        onClick={() => setOpenModal(true)}
      >
        <AddIcon />
      </Fab>

      {/* Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="create-project-modal"
      >
        <Box
          component="form"
          onSubmit={handleAddProject}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "rgba(20,20,20,0.95)",
            color: "#fff",
            borderRadius: 3,
            p: 4,
            boxShadow: 24,
            backdropFilter: "blur(6px)",
          }}
        >
          <Typography id="create-project-modal" variant="h6" sx={{ mb: 2 }}>
            Create New Project
          </Typography>

          <TextField
            label="Project Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={commonInputStyles}
          />

          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={commonInputStyles}
          />

          <TextField
            label="Due Date"
            type="date"
            fullWidth
            margin="normal"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={commonInputStyles}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.2,
              bgcolor: "#4f46e5",
              "&:hover": { bgcolor: "#3730a3" },
              fontWeight: 600,
            }}
          >
            Add Project
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
