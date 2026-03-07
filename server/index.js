const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

// Load .env from project root (works locally; in Docker, env vars come from docker-compose)
try {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
} catch {
  // dotenv not required in production — env vars set externally
}

const assignmentRoutes = require('./routes/assignments');
const submissionRoutes = require('./routes/submissions');

const app = express();
const PORT = process.env.SERVER_PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:4028', 'http://127.0.0.1:4028'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/codecampus';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Make sure MongoDB is running. Install: https://www.mongodb.com/try/download/community');
  });

// Routes
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CodeCampus API running on http://localhost:${PORT}`);
});
