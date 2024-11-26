import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from "./components/auth/LoginForm.js";
import RegisterForm from "./components/auth/RegisterForm";
import {Dashboard} from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';

// const App = ()=>{
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//         try {
//             const response = await fetch("/api/auth/check", {
//                 method: "GET",
//                 credentials: "include",
//             });

//             setIsAuthenticated(response.ok);
//         } catch (error) {
//             console.error("Error checking authentication:", error);
//             setIsAuthenticated(false);
//         }
//     };

//     checkAuth();
//   }, []);

//   return (
//     <Router>
//         <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route
//                 path="/"
//                 element={
//                     <ProtectedRoute isAuthenticated={isAuthenticated}>
//                         <Dashboard />
//                     </ProtectedRoute>
//                 }
//             />
//             <Route path="/logout" element={<Logout />} />
//         </Routes>
//     </Router>
// );

// };
// export default App;

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

// function App() {
//   return (
//     <Router>
//       <Header />
//       <Routes>
//         <Route path="/" element={<Dashboard />} />
//       </Routes>
//     </Router>
//   );
// }
// export default App;

// function App() {
//   return (
//     <Router>
//     <Header />
//     <Routes>
//       <Route path="/" element={<Dashboard />} />
//     </Routes>
//   </Router>
//   );
// }

// export default App;


// import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
// import Header from './Header'; // Assuming you have a Header component
// import Dashboard from './Dashboard'; // Assuming you have a Dashboard component

// function App() {

//   return (
//     <>
//       <Header />
//       <Routes>
//         <Route path="/*" element={<Dashboard />} /> {/* Allow nested routing */}
//         <Route path="/projects/:projectId" element={<ProjectDetails />} />
//       </Routes>
//     </>
//   );
// }

// export default App;




// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
