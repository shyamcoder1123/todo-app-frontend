import axios from 'axios';

// Create an Axios instance to manage requests
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Replace with your backend API base URL
});

// Add an interceptor to automatically add the Authorization header
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (or sessionStorage)
    const token = localStorage.getItem('authToken');

    if (token) {
      // If token exists, add it to the headers of the request
      config.headers['Authorization'] = `Basic ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define API calls
export const getProjects = () => api.get('/projects');
export const addProject = (project) => api.post('/projects', project);
export const updateProject = (id, title) => api.put(`/projects/${id}`, { title });
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const getTodos = (projectId) =>
  api.get('/todos', { params: { projectId } });
export const addTodo = (todo) => api.post('/todos', todo);
export const updateTodo = (todo) => api.put('/todos', todo);
export const deleteTodo = (id) => api.delete(`/todos/${id}`);

export default api;

