// server.js
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');  // Ensure correct path
require('dotenv').config();  // Load environment variables from .env

const app = express();

// Middleware
app.use(express.json());  // Parse JSON request bodies 
app.use(session({ 
    secret: 'mysecret', 
    resave: false, 
    saveUninitialized: false 
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/users', userRoutes);  // Use '/users' for user-related routes

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));
