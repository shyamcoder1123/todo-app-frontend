import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from "./components/auth/LoginForm.js";
import RegisterForm from "./components/auth/RegisterForm";
import {Dashboard} from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    // Handle authentication success
    const handleLoginSuccess = () => {
      setIsAuthenticated(true);
    };
  
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <LoginForm onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/register" element={<RegisterForm />} />
          {/* Define route for project details */}
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
        </Routes>
      </Router>
    );
  }
  
  export default App;
