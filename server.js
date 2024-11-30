const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');  // Ensure correct path
const rentRoutes = require('./routes/rentRoutes');
const eventRoutes = require('./routes/eventRoutes');
require('dotenv').config(); // Load environment variables from .env

const app = express();

// Middleware
app.use(express.json());  // Parse JSON request bodies 
app.use(session({ 
    secret: 'mysecret', 
    resave: false, 
    saveUninitialized: false 
}));

// CORS Configuration
app.use(cors({
  origin: [
    'https://remix-front.onrender.com',  // Frontend domain
    'https://admin-proyecto-web.onrender.com'  // Admin domain
], // Replace with your frontend domain
    credentials: true // Allow cookies and credentials
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/users', userRoutes);  // User routes
app.use('/books', bookRoutes);   // Book routes
app.use('/rent', rentRoutes);
app.use('/event', eventRoutes);

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));
