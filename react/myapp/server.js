const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = 'mongodb://localhost:27017/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }, // Role field
});

const User = mongoose.model('User', userSchema);
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Role determination logic
    let role = username.length >= 5 ? 'admin' : 'user';

    // Validation checks
    if (role === 'admin' && username.length == 5) {
      return res.status(400).json({ message: 'Admin username must be at least 5 characters long' });
    }
    if (role === 'user' && username.length == 3) {
      return res.status(400).json({ message: 'User username must be at least 3 characters long' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', role });
  } catch (error) {
    console.error('Error during registration:', error); // Log error to console
    res.status(400).json({ message: error.message });   // Send detailed error to client
  }
});



app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate a token with role included
    const token = jwt.sign({ id: user._id, role: user.role }, 'secret', { expiresIn: '1h' });

    // Send response with role-based dashboard redirect
    res.json({ 
      token, 
      user: { id: user._id, username: user.username, role: user.role },
      redirectTo: user.role === 'admin' ? '/admindashboard' : '/userdashboard'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Middleware to verify the role
const verifyRole = (role) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Access denied, no token provided' });

    try {
      const decoded = jwt.verify(token, 'secret');
      if (decoded.role !== role) {
        return res.status(403).json({ message: 'Access denied, insufficient permissions' });
      }
      req.user = decoded;
      next();
    } catch (error) {
      res.status(403).json({ message: 'Invalid token' });
    }
  };
};

// Admin-only route
app.get('/admindashboard', verifyRole('admin'), (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard!' });
});

// User-only route
app.get('/userdashboard', verifyRole('user'), (req, res) => {
  res.json({ message: 'Welcome to the User Dashboard!' });
});

app.listen(5000, () => console.log('Server running on port 5000'));
