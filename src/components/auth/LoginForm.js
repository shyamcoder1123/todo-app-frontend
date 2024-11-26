import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const credentials = btoa(`${username}:${password}`);

    try {
      const response = await axios.get('http://localhost:8080/api/projects', {
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      });

      localStorage.setItem('authToken', credentials);
      localStorage.setItem('username', username);
      onLoginSuccess();
    } catch (error) {
      setErrorMessage('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Login</h2>
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
              <p className="mt-3 text-center">
                Don't have an account? <Link to="/register">Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
