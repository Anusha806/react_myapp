import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './register';
import Login from './login';
import Navbar from './navbar';
import AdminDashboard from './admindashboard';
import UserDashboard from './userdashboard';

export const AuthContext = createContext();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // Track role

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userRole, setUserRole }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin-dashboard"
            element={isAuthenticated && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/user-dashboard"
            element={isAuthenticated && userRole === 'user' ? <UserDashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
