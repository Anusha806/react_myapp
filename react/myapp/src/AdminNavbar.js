import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear token
    localStorage.removeItem('userRole'); // Clear role
    navigate('/login'); // Redirect to login
  };

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/admin-dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin-orders">Orders</Link>  
        </li>
        <li>
          <Link to="/admin-menu">Manage Menu</Link>
        </li>
        <li>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
