import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CodeSaga Backend Server is running',
    mongodbConnected: mongoose.connection.readyState === 1
  });
});

app.get('/', (req, res) => {
  res.json({
    app: 'CodeSaga API Server',
    version: '1.0.0'
  });
});

// Global 404 JSON Fallback Handler (prevents HTML 404 responses)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.message);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    message: err.message || 'Internal Server Error'
  });
});

// Database Connection
if (!MONGODB_URI || MONGODB_URI.includes('<db_password>')) {
  console.warn('⚠️ MONGODB_URI is not fully configured in server/.env.');
  console.warn('⚠️ Please replace <db_username> and <db_password> in server/.env with your MongoDB Atlas credentials.');
} else {
  console.log('🔄 Attempting to connect to MongoDB Atlas (Database: CodeSaga, Collection: codesaga_users)...');
  mongoose.connect(MONGODB_URI, { dbName: 'CodeSaga' })
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch((err) => {
      console.error('MongoDB connection failed:', err.message);
    });
}

app.listen(PORT, () => {
  console.log(`🚀 CodeSaga Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 CORS allowed for: ${FRONTEND_URL}`);
  console.log('Password route registered: POST /api/users/set-password');
});
