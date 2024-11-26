import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectList from '../components/ProjectList';

export const Dashboard = () => {
  const navigate = useNavigate();

  const handleProjectSelect = (id) => {
    navigate(`/projects/${id}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Dashboard</h1>
      <div className="row">
        <div className="col-12">
          <ProjectList onProjectSelect={handleProjectSelect} />
        </div>
      </div>
    </div>
  );
};
