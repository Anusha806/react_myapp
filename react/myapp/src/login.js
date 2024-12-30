import React, { useState, useContext } from 'react';
import axios from 'axios';
import './form.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './App'; // Assuming you have an AuthContext in App.js

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post('http://localhost:5000/login', form);

      // Save token and set auth state
      localStorage.setItem('authToken', data.token);
      setIsAuthenticated(true);

      // Redirect to the respective dashboard
      navigate(data.redirectTo); // '/admindashboard' or '/userdashboard'
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Invalid credentials');
      } else {
        setError('Network error or timeout occurred');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/">Register</Link>
      </p>
    </div>
  );
};

export default Login;
