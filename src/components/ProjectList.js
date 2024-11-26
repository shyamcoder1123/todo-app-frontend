import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getProjects, addProject, deleteProject } from '../services/api';


const ProjectList = ({onProjectSelect}) => {
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const getUsernameFromToken = () => {
    const storedUsername = localStorage.getItem('username');
    console.log('stored name',storedUsername);
    if (storedUsername) {
      return storedUsername;
    }
    return null;  // If no token or an error occurred, return null
  };
  
  

  const loadProjects = async () => {
    // const response = await getProjects();
    // console.log(response);
    // setProjects(response.data);
    try {
      const response = await getProjects();
      console.log('API Response:', response);
      setProjects(response.data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      // Optionally, set an error state to show a message in the UI
    }
  };

  const handleAddProject = async () => {
    if (newProjectTitle.trim()) {
      const username = getUsernameFromToken();
      if (username) {
        await addProject({ title: newProjectTitle, username: username });
        setNewProjectTitle('');
        loadProjects();
      } else {
        console.error('Username not found in the token.');
      }
    }
  };

  const handleDeleteProject = async (id) => {
    await deleteProject(id);
    loadProjects();
  };

  // const handleProjectClick = (id) => {
  //   onProjectSelect(id);  // Pass the selected project ID to the parent
  // };

  const handleProjectClick = (id, title) => {
    console.log(`Navigating to /projects/${id}`);
    navigate(`/projects/${id}`, { state: { title } }); // Navigate to the project details page
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Projects</h5>
      </div>
      <div className="card-body">
        {/* Input for Adding New Project */}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
            placeholder="Enter new project title"
          />
          <button
            className="btn btn-success"
            onClick={handleAddProject}
            disabled={!newProjectTitle.trim()} // Disable if input is empty
          >
            Add Project
          </button>
        </div>

        {/* Project List */}
        {projects.length > 0 ? (
          <ul className="list-group">
            {projects.map((project) => (
              <li
                key={project.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{project.title}</span>
                <div>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleProjectClick(project.id, project.title)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No projects available. Add one above!</p>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
