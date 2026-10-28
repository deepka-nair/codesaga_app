import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';

const router = express.Router();
const DEVELOPER_EMAIL = 'deepkav5008.sse@saveetha.com';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

/**
 * Mask PII email addresses for safe logging in production
 * e.g., deepkav5008.sse@saveetha.com -> d***e@saveetha.com
 */
const maskEmail = (email) => {
  const clean = normalizeEmail(email);
  if (!clean || !clean.includes('@')) return 'anonymous';
  const [local, domain] = clean.split('@');
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}${'*'.repeat(Math.max(1, local.length - 2))}${local.slice(-1)}@${domain}`;
};

/**
 * Robust secret key for HMAC token signing and verification.
 * Sourced from SESSION_SECRET or JWT_SECRET if present; falls back to a deterministic SHA256
 * derived from MONGODB_URI to preserve validity across server restarts without external dependencies.
 */
const AUTH_SECRET = process.env.SESSION_SECRET || 
  process.env.JWT_SECRET || 
  (process.env.MONGODB_URI ? crypto.createHash('sha256').update(process.env.MONGODB_URI + '_codesaga_auth_salt_2026').digest('hex') : 'codesaga_defensive_sec_key_2026_x89a1f');

/**
 * Create a cryptographically signed, tamper-proof session token (HMAC-SHA256).
 */
export const createAuthToken = (user) => {
  const payload = {
    userId: user.userId || user._id?.toString() || 'USR_UNKNOWN',
    email: normalizeEmail(user.email),
    role: user.role || 'user',
    iat: Date.now(),
    exp: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days validity
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
};

/**
 * Verify and decode an HMAC-signed session token with timing-safe comparison.
 */
export const verifyAuthToken = (tokenStr) => {
  if (!tokenStr || typeof tokenStr !== 'string') return null;
  const parts = tokenStr.split('.');
  if (parts.length !== 2) return null;
  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(encodedPayload).digest('base64url');

  if (signature.length !== expectedSignature.length) return null;
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
};

/**
 * Extract authenticated user credentials from Authorization Bearer or x-auth-token headers.
 */
export const extractAuthUser = (req) => {
  const authHeader = req.headers.authorization;
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers['x-auth-token']) {
    token = String(req.headers['x-auth-token']).trim();
  }
  if (!token) return null;
  return verifyAuthToken(token);
};

/**
 * In-memory sliding-window IP rate limiter for authentication endpoints.
 * Enforces 10 attempts per 15-minute window per IP with automatic memory cleanup.
 * 
 * SEC-02 Compliance:
 * Production default is strictly 10 attempts per 15-minute window.
 * In explicit non-production test/staging environments (NODE_ENV === 'test' or
 * TEST_MODE === 'true'), process.env.AUTH_RATE_LIMIT_MAX can configure an elevated
 * threshold if requested for specific test runs. It NEVER activates by default in production.
 */
const loginAttempts = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_LOGIN_ATTEMPTS = 10;

const getMaxLoginAttempts = () => {
  const isTestEnv = process.env.NODE_ENV === 'test' || process.env.TEST_MODE === 'true';
  if (isTestEnv && process.env.AUTH_RATE_LIMIT_MAX) {
    const parsed = parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return DEFAULT_MAX_LOGIN_ATTEMPTS;
};

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of loginAttempts.entries()) {
    if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
      loginAttempts.delete(key);
    }
  }
}, 10 * 60 * 1000).unref();

export const authRateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, startTime: now };

  if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    record.count = 1;
    record.startTime = now;
    loginAttempts.set(ip, record);
    return next();
  }

  record.count++;
  loginAttempts.set(ip, record);

  const effectiveMax = getMaxLoginAttempts();
  if (record.count > effectiveMax) {
    const retryAfterSec = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - record.startTime)) / 1000);
    res.setHeader('Retry-After', retryAfterSec);
    return res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again after 15 minutes.'
    });
  }

  next();
};

/**
 * Strict schema & range validation for progress update payloads
 */
const validateProgressInput = (data) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, message: 'Invalid progress data format.' };
  }
  const clean = {};

  if (data.xp !== undefined) {
    if (typeof data.xp !== 'number' || !Number.isFinite(data.xp) || data.xp < 0 || data.xp > 10000000) {
      return { valid: false, message: 'XP must be a non-negative number up to 10,000,000.' };
    }
    clean.xp = Math.floor(data.xp);
  }

  if (data.level !== undefined) {
    if (typeof data.level !== 'number' || !Number.isFinite(data.level) || data.level < 1 || data.level > 1000) {
      return { valid: false, message: 'Level must be an integer between 1 and 1,000.' };
    }
    clean.level = Math.floor(data.level);
  }

  if (data.coins !== undefined) {
    if (typeof data.coins !== 'number' || !Number.isFinite(data.coins) || data.coins < 0 || data.coins > 5000000) {
      return { valid: false, message: 'Coins must be a non-negative number up to 5,000,000.' };
    }
    clean.coins = Math.floor(data.coins);
  }

  if (data.streak !== undefined) {
    if (typeof data.streak !== 'number' || !Number.isFinite(data.streak) || data.streak < 0 || data.streak > 10000) {
      return { valid: false, message: 'Streak must be a non-negative integer.' };
    }
    clean.streak = Math.floor(data.streak);
  }

  if (data.completedMissions !== undefined) {
    if (!Array.isArray(data.completedMissions)) {
      return { valid: false, message: 'completedMissions must be an array.' };
    }
    clean.completedMissions = data.completedMissions.map(m => String(m).trim().slice(0, 100)).filter(Boolean);
  }

  if (data.completedChapters !== undefined) {
    if (!Array.isArray(data.completedChapters)) {
      return { valid: false, message: 'completedChapters must be an array.' };
    }
    clean.completedChapters = data.completedChapters.map(c => Number(c)).filter(c => Number.isInteger(c) && c >= 0);
  }

  if (data.unlockedChapters !== undefined) {
    if (!Array.isArray(data.unlockedChapters)) {
      return { valid: false, message: 'unlockedChapters must be an array.' };
    }
    clean.unlockedChapters = data.unlockedChapters.map(c => Number(c)).filter(c => Number.isInteger(c) && c >= 1);
  }

  if (data.currentWorld !== undefined) {
    const allowedWorlds = ['sql', 'python', 'java', 'frontend', 'cpp', 'backend'];
    const worldStr = String(data.currentWorld).trim().toLowerCase();
    if (!allowedWorlds.includes(worldStr)) {
      return { valid: false, message: `Invalid currentWorld: must be one of ${allowedWorlds.join(', ')}` };
    }
    clean.currentWorld = worldStr;
  }

  if (data.earnedAchievements !== undefined && Array.isArray(data.earnedAchievements)) {
    clean.earnedAchievements = data.earnedAchievements.map(a => String(a).trim().slice(0, 100)).filter(Boolean);
  }

  if (data.worldProgress && typeof data.worldProgress === 'object') {
    clean.worldProgress = data.worldProgress;
  }

  if (data.certificates && typeof data.certificates === 'object') {
    clean.certificates = data.certificates;
  }

  if (data.worldCertificates && typeof data.worldCertificates === 'object') {
    clean.worldCertificates = data.worldCertificates;
  }

  return { valid: true, clean };
};

/**
 * Safe error message generator that prevents internal diagnostic leaks in production
 */
const safeErrorResponse = (res, statusCode, publicMessage, error) => {
  const isProduction = process.env.NODE_ENV === 'production';
  console.error(`[Error ${statusCode}] ${publicMessage}:`, error?.stack || error?.message || error);
  return res.status(statusCode).json({
    success: false,
    message: publicMessage,
    error: isProduction ? publicMessage : (error?.message || publicMessage)
  });
};

/**
 * Validate password requirements:
 * - Minimum 8 characters
 * - At least one letter
 * - At least one number
 */
const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required.' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number.' };
  }
  return { valid: true };
};

/**
 * GET /api/users/:email
 * Check if a user exists in codesaga_users and return their profile & password configuration status
 */
router.get('/:email', async (req, res) => {
  try {
    const rawEmail = req.params.email;
    const cleanEmail = normalizeEmail(rawEmail);

    if (!cleanEmail || cleanEmail.includes('guest_')) {
      return res.json({ success: true, exists: false, isGuest: true, hasPassword: false });
    }

    console.log(`[MongoDB User Lookup] Querying codesaga_users for: ${maskEmail(cleanEmail)}`);

    if (mongoose.connection.readyState !== 1) {
      console.warn('[MongoDB User Lookup] Database not connected (readyState !== 1).');
      return res.json({
        success: true,
        exists: false,
        offline: true,
        message: 'Database temporarily unavailable.'
      });
    }

    const user = await User.findOne({ email: cleanEmail }).select('+password_hash');

    if (!user) {
      console.log(`[MongoDB User Lookup] User not found: ${maskEmail(cleanEmail)}`);
      return res.json({ success: true, exists: false, hasPassword: false });
    }

    // Developer role enforcement
    if (cleanEmail === DEVELOPER_EMAIL && user.role !== 'developer') {
      user.role = 'developer';
      await user.save();
    }

    const hasPassword = Boolean(user.password_hash);
    const userObj = user.toObject();
    delete userObj.password_hash;

    return res.json({
      success: true,
      exists: true,
      hasPassword,
      user: userObj
    });
  } catch (error) {
    return safeErrorResponse(res, 500, 'Database lookup error', error);
  }
});

/**
 * POST /api/users
 * Create/register new user in codesaga_users collection with optional password_hash
 */
router.post('/', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const cleanEmail = normalizeEmail(email);
    const cleanUsername = String(username || '').trim() || (cleanEmail.includes('@') ? cleanEmail.split('@')[0] : 'Detective');

    if (!cleanEmail || cleanEmail.includes('guest_')) {
      return res.json({ success: true, isGuest: true, user: { name: 'Guest Sleuth', email: null, role: 'guest' } });
    }

    console.log(`[MongoDB User Registration] Request for: ${maskEmail(cleanEmail)}`);

    if (mongoose.connection.readyState !== 1) {
      console.warn('[MongoDB User Registration] Database not connected.');
      return res.status(503).json({ success: false, message: 'Database unavailable. Cannot register new user.' });
    }

    let user = await User.findOne({ email: cleanEmail }).select('+password_hash');

    // If password provided, validate
    let hashedPassword = null;
    if (password) {
      const passVal = validatePassword(password);
      if (!passVal.valid) {
        return res.status(400).json({ success: false, message: passVal.message });
      }
      hashedPassword = await bcrypt.hash(password, 12);
    }

    if (user) {
      console.log(`[MongoDB User Registration] Existing user found: ${maskEmail(cleanEmail)}`);
      user.lastLogin = new Date();
      if (cleanEmail === DEVELOPER_EMAIL) {
        user.role = 'developer';
      }
      if (hashedPassword) {
        user.password_hash = hashedPassword;
      }
      await user.save();
      const userObj = user.toObject();
      delete userObj.password_hash;
      const token = createAuthToken(user);
      return res.json({ success: true, exists: true, created: false, user: userObj, token });
    }

    const role = cleanEmail === DEVELOPER_EMAIL ? 'developer' : 'user';
    const userId = `USR_${Date.now().toString(36).toUpperCase()}`;

    user = new User({
      userId,
      email: cleanEmail,
      username: cleanUsername,
      role,
      password_hash: hashedPassword,
      verified: true,
      createdAt: new Date(),
      lastLogin: new Date(),
      xp: 0,
      level: 1,
      streak: 0,
      coins: 0,
      completedMissions: [],
      completedChapters: [],
      unlockedChapters: [1],
      currentWorld: 'sql',
      earnedAchievements: [],
      worldProgress: {
        sqlProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
        pythonProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
        javaProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
        frontendProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
        cppProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
        backendProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] }
      },
      certificates: {
        certificateIssued: false,
        certificateId: '',
        certificateIssuedAt: '',
        certificateName: cleanUsername,
        worldCertificates: {}
      }
    });

    await user.save();
    console.log(`[MongoDB User Registration] Successfully created user ${maskEmail(cleanEmail)} in codesaga_users`);

    const userObj = user.toObject();
    delete userObj.password_hash;
    const token = createAuthToken(user);

    return res.status(201).json({
      success: true,
      exists: true,
      created: true,
      user: userObj,
      token
    });
  } catch (error) {
    return safeErrorResponse(res, 500, 'User registration failed', error);
  }
});

/**
 * POST /api/users/set-password
 * Set or reset CodeSaga password for a verified user email (Rate limited)
 */
router.post('/set-password', authRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = normalizeEmail(email);

    console.log(`[MongoDB Set Password] Request received for: ${maskEmail(cleanEmail)}`);

    if (!cleanEmail || cleanEmail.includes('guest_')) {
      return res.status(400).json({ success: false, message: 'Guest accounts cannot configure passwords.' });
    }

    const passVal = validatePassword(password);
    if (!passVal.valid) {
      return res.status(400).json({ success: false, message: passVal.message });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database temporarily unavailable.' });
    }

    let user = await User.findOne({ email: cleanEmail }).select('+password_hash');
    const hashedPassword = await bcrypt.hash(password, 12);

    if (!user) {
      const role = cleanEmail === DEVELOPER_EMAIL ? 'developer' : 'user';
      const userId = `USR_${Date.now().toString(36).toUpperCase()}`;
      const username = cleanEmail.split('@')[0];

      user = new User({
        userId,
        email: cleanEmail,
        username,
        role,
        password_hash: hashedPassword,
        verified: true,
        createdAt: new Date(),
        lastLogin: new Date()
      });
    } else {
      user.password_hash = hashedPassword;
      user.lastLogin = new Date();
      if (cleanEmail === DEVELOPER_EMAIL) {
        user.role = 'developer';
      }
    }

    await user.save();
    console.log(`[MongoDB Set Password] Password saved successfully for: ${maskEmail(cleanEmail)}`);

    const userObj = user.toObject();
    delete userObj.password_hash;
    const token = createAuthToken(user);

    return res.status(200).json({
      success: true,
      message: 'Password set successfully',
      user: userObj,
      token
    });
  } catch (error) {
    return safeErrorResponse(res, 500, 'Failed to configure password', error);
  }
});

/**
 * POST /api/users/login-password
 * Authenticate existing user with email + password (Rate limited)
 */
router.post('/login-password', authRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = normalizeEmail(email);

    console.log(`[MongoDB Password Login] Request received for: ${maskEmail(cleanEmail)}`);

    if (!cleanEmail || !password) {
      return res.status(400).json({ success: false, message: 'Incorrect email or password.' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Unable to connect to CodeSaga. Please try again.' });
    }

    const user = await User.findOne({ email: cleanEmail }).select('+password_hash');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Incorrect email or password.',
        message: 'Incorrect email or password.'
      });
    }

    if (!user.password_hash) {
      return res.status(401).json({ 
        success: false, 
        error: 'Password not configured. Please verify your email and create a password.',
        message: 'Password not configured. Please verify your email and create a password.',
        requiresOtpSetup: true
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        error: 'Incorrect email or password.',
        message: 'Incorrect email or password.' 
      });
    }

    user.lastLogin = new Date();
    if (cleanEmail === DEVELOPER_EMAIL) {
      user.role = 'developer';
    }
    await user.save();

    const userObj = user.toObject();
    delete userObj.password_hash;
    const token = createAuthToken(user);

    return res.json({
      success: true,
      exists: true,
      user: userObj,
      token
    });
  } catch (error) {
    return safeErrorResponse(res, 500, 'Incorrect email or password.', error);
  }
});

/**
 * POST /api/users/login
 * Record user login timestamp in MongoDB
 */
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || cleanEmail.includes('guest_')) {
      return res.json({ success: true, isGuest: true });
    }

    console.log(`[MongoDB User Login] Record login for: ${maskEmail(cleanEmail)}`);

    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, offline: true });
    }

    const user = await User.findOne({ email: cleanEmail }).select('+password_hash');
    if (!user) {
      return res.json({ success: true, exists: false });
    }

    user.lastLogin = new Date();
    if (cleanEmail === DEVELOPER_EMAIL) {
      user.role = 'developer';
    }
    await user.save();

    const userObj = user.toObject();
    delete userObj.password_hash;
    const token = createAuthToken(user);

    return res.json({ success: true, exists: true, user: userObj, token });
  } catch (error) {
    return safeErrorResponse(res, 500, 'Login failed', error);
  }
});

/**
 * GET /api/users/:email/progress
 * Get progress stored in MongoDB (Ownership & authentication enforced)
 */
router.get('/:email/progress', async (req, res) => {
  try {
    const cleanEmail = normalizeEmail(req.params.email);
    if (!cleanEmail || cleanEmail.includes('guest_')) {
      return res.json({ success: true, isGuest: true, progress: null });
    }

    console.log(`[MongoDB Progress Lookup] Fetch progress for: ${maskEmail(cleanEmail)}`);

    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, offline: true, progress: null });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Authorization & Ownership Verification:
    // Prevents IDOR/BOLA by ensuring only the account owner or developer can read stored progress.
    const authUser = extractAuthUser(req);
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to access user progress.'
      });
    }

    if (normalizeEmail(authUser.email) !== cleanEmail && authUser.role !== 'developer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot view progress for another detective account.'
      });
    }

    return res.json({
      success: true,
      progress: {
        xp: user.xp,
        level: user.level,
        coins: user.coins,
        streak: user.streak,
        completedMissions: user.completedMissions,
        completedChapters: user.completedChapters,
        unlockedChapters: user.unlockedChapters,
        currentWorld: user.currentWorld,
        earnedAchievements: user.earnedAchievements,
        worldProgress: user.worldProgress,
        certificates: user.certificates
      }
    });
  } catch (error) {
    return safeErrorResponse(res, 500, 'Failed to fetch progress', error);
  }
});

/**
 * PUT /api/users/:email/progress
 * Update progress snapshot in MongoDB (Ownership & authentication enforced + strict input validation)
 */
router.put('/:email/progress', async (req, res) => {
  try {
    const cleanEmail = normalizeEmail(req.params.email);
    if (!cleanEmail || cleanEmail.includes('guest_')) {
      return res.json({ success: true, isGuest: true, message: 'Guest progress ignored' });
    }

    console.log(`[MongoDB Progress Update] Updating progress for: ${maskEmail(cleanEmail)}`);

    if (mongoose.connection.readyState !== 1) {
      console.warn('[MongoDB Progress Update] Database not connected. Progress not saved to cloud.');
      return res.json({ success: true, offline: true, message: 'Progress saved locally only' });
    }

    // Authorization & Ownership Verification
    const authUser = extractAuthUser(req);
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to update user progress.'
      });
    }

    if (normalizeEmail(authUser.email) !== cleanEmail && authUser.role !== 'developer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot modify progress for another detective account.'
      });
    }

    // Input Validation
    const validation = validateProgressInput(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }
    const progressData = validation.clean;

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (progressData.xp !== undefined) user.xp = progressData.xp;
    if (progressData.level !== undefined) user.level = progressData.level;
    if (progressData.coins !== undefined) user.coins = progressData.coins;
    if (progressData.streak !== undefined) user.streak = progressData.streak;
    if (progressData.completedMissions !== undefined) user.completedMissions = progressData.completedMissions;
    if (progressData.completedChapters !== undefined) user.completedChapters = progressData.completedChapters;
    if (progressData.unlockedChapters !== undefined) user.unlockedChapters = progressData.unlockedChapters;
    if (progressData.currentWorld !== undefined) user.currentWorld = progressData.currentWorld;
    if (progressData.earnedAchievements !== undefined) user.earnedAchievements = progressData.earnedAchievements;

    if (progressData.worldProgress) {
      user.worldProgress = {
        sqlProgress: { ...user.worldProgress?.sqlProgress, ...progressData.worldProgress.sqlProgress },
        pythonProgress: { ...user.worldProgress?.pythonProgress, ...progressData.worldProgress.pythonProgress },
        javaProgress: { ...user.worldProgress?.javaProgress, ...progressData.worldProgress.javaProgress },
        frontendProgress: { ...user.worldProgress?.frontendProgress, ...progressData.worldProgress.frontendProgress },
        cppProgress: { ...user.worldProgress?.cppProgress, ...progressData.worldProgress.cppProgress },
        backendProgress: { ...user.worldProgress?.backendProgress, ...progressData.worldProgress.backendProgress }
      };
    }

    if (progressData.certificates) {
      user.certificates = { ...user.certificates, ...progressData.certificates };
    }
    if (progressData.worldCertificates) {
      user.certificates.worldCertificates = { ...user.certificates.worldCertificates, ...progressData.worldCertificates };
    }

    user.markModified('worldProgress');
    user.markModified('certificates');

    await user.save();
    console.log(`[MongoDB Progress Update] Successfully saved progress for ${maskEmail(cleanEmail)} (XP: ${user.xp}, Level: ${user.level})`);

    return res.json({
      success: true,
      message: 'Progress updated successfully in MongoDB Atlas (codesaga_users)'
    });
  } catch (error) {
    return safeErrorResponse(res, 500, 'Failed to update progress', error);
  }
});

/**
 * GET /api/users/:email/certificate
 * Retrieve certificate details for a user from MongoDB (Ownership & authentication enforced)
 */
router.get('/:email/certificate', async (req, res) => {
  try {
    const cleanEmail = normalizeEmail(req.params.email);
    if (!cleanEmail || cleanEmail.includes('guest_')) {
      return res.status(404).json({ success: false, message: 'No certificates found for guest session.' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database temporarily unavailable. Please try again.' });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    // Authorization & Ownership Verification
    const authUser = extractAuthUser(req);
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to access certificate details.'
      });
    }

    if (normalizeEmail(authUser.email) !== cleanEmail && authUser.role !== 'developer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot view certificates belonging to another account.'
      });
    }

    const hasCert = Boolean(
      user.certificates && 
      (user.certificates.certificateIssued || user.certificates.certificateId || Object.keys(user.certificates.worldCertificates || {}).length > 0)
    );

    if (!hasCert) {
      return res.status(404).json({ 
        success: false, 
        message: 'No official certificates have been issued to this account yet.' 
      });
    }

    return res.json({
      success: true,
      certificates: user.certificates
    });
  } catch (error) {
    return safeErrorResponse(res, 500, 'Failed to retrieve certificate', error);
  }
});

/**
 * PUT /api/users/:email/certificate
 * Save or update certificate details (Ownership & authentication enforced)
 */
router.put('/:email/certificate', async (req, res) => {
  try {
    const cleanEmail = normalizeEmail(req.params.email);
    if (!cleanEmail || cleanEmail.includes('guest_')) {
      return res.json({ success: true, isGuest: true });
    }

    // Authorization & Ownership Verification
    const authUser = extractAuthUser(req);
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to issue or update certificates.'
      });
    }

    if (normalizeEmail(authUser.email) !== cleanEmail && authUser.role !== 'developer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot modify certificates for another detective account.'
      });
    }

    const { worldId, certificateId, certificateIssuedAt, certificateName } = req.body;

    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, offline: true });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (worldId) {
      const allowedWorlds = ['sql', 'python', 'java', 'frontend', 'cpp', 'backend'];
      const cleanWorld = String(worldId).trim().toLowerCase();
      if (!allowedWorlds.includes(cleanWorld)) {
        return res.status(400).json({ success: false, message: 'Invalid worldId specified for certificate.' });
      }

      const currentCerts = user.certificates?.worldCertificates || {};
      const newCert = {
        id: String(certificateId || '').trim().slice(0, 50),
        issued_at: certificateIssuedAt || new Date().toISOString(),
        world_id: cleanWorld
      };

      user.certificates.worldCertificates = {
        ...currentCerts,
        [cleanWorld]: newCert
      };
    } else {
      user.certificates.certificateIssued = true;
      if (certificateId) user.certificates.certificateId = String(certificateId).trim().slice(0, 50);
      if (certificateIssuedAt) user.certificates.certificateIssuedAt = String(certificateIssuedAt).trim().slice(0, 50);
      if (certificateName) user.certificates.certificateName = String(certificateName).trim().slice(0, 100);
    }

    user.markModified('certificates');
    await user.save();

    return res.json({
      success: true,
      certificates: user.certificates
    });
  } catch (error) {
    return safeErrorResponse(res, 500, 'Failed to update certificate', error);
  }
});

export default router;
