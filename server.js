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
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(__dirname, 'server', '.env') });
}

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI;

const allowedOrigins = Array.from(new Set([
  'https://codesaga-app-1.onrender.com',
  'https://appassets.androidplatform.net',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean)));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`[CORS Blocked] Origin not allowed: ${origin}`);
    return callback(new Error(`CORS policy does not allow access from origin ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));

// HTTP Defensive Security Headers (Defends against clickjacking, MIME-sniffing, and insecure framing)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://api.qrserver.com https://avatars.githubusercontent.com; connect-src 'self' http://localhost:* ws://localhost:* https://*.onrender.com https://api.github.com https://api.emailjs.com https://api.resend.com; frame-ancestors 'self' https://appassets.androidplatform.net;"
  );
  next();
});

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

// Global Error Handler (Sanitizes internal error messages in production)
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack || err.message);
  const isProduction = process.env.NODE_ENV === 'production';
  const safeMessage = isProduction 
    ? 'Internal Server Error. Please try again later.'
    : (err.message || 'Internal Server Error');
  res.status(500).json({
    success: false,
    error: safeMessage,
    message: safeMessage
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
