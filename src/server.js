const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const classRoutes = require('./routes/classes');
const courseRoutes = require('./routes/courses');
const discussionRoutes = require('./routes/discussions');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/classes', classRoutes);
app.use('/courses', courseRoutes);
app.use('/discussions', discussionRoutes);
app.use('/reports', reportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'LMS Backend API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 LMS Backend server is running on port ${PORT}`);
});