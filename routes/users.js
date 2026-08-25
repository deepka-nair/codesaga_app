import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();
const DEVELOPER_EMAIL = 'deepkav5008.sse@saveetha.com';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

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

    console.log(`[MongoDB User Lookup] Querying codesaga_users for: ${cleanEmail}`);

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
      console.log(`[MongoDB User Lookup] User not found: ${cleanEmail}`);
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

    console.log(`[MongoDB User Lookup] Found user: ${user.username} (${user.role}), hasPassword: ${hasPassword}`);
    return res.json({
      success: true,
      exists: true,
      hasPassword,
      user: userObj
    });
  } catch (error) {
    console.error('[MongoDB User Lookup Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Database lookup error', error: error.message });
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

    console.log(`[MongoDB User Registration] Request for: ${cleanEmail} (Username: ${cleanUsername})`);

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
      console.log(`[MongoDB User Registration] Existing user found: ${cleanEmail}`);
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
      return res.json({ success: true, exists: true, created: false, user: userObj });
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
    console.log(`[MongoDB User Registration] Successfully created user ${cleanUsername} (${userId}) in codesaga_users`);

    const userObj = user.toObject();
    delete userObj.password_hash;

    return res.status(201).json({
      success: true,
      exists: true,
      created: true,
      user: userObj
    });
  } catch (error) {
    console.error('[MongoDB User Registration Error]:', error.message);
    return res.status(500).json({ success: false, message: 'User registration failed', error: error.message });
  }
});

/**
 * POST /api/users/set-password
 * Set or reset CodeSaga password for a verified user email
 */
router.post('/set-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = normalizeEmail(email);

    console.log(`[MongoDB Set Password] Request received for: ${cleanEmail}`);

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
      // If user doesn't exist yet, create account
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
    console.log(`[MongoDB Set Password] Password hash saved successfully for: ${cleanEmail}`);

    const userObj = user.toObject();
    delete userObj.password_hash;

    return res.status(200).json({
      success: true,
      message: 'Password set successfully',
      user: userObj
    });
  } catch (error) {
    console.error('[MongoDB Set Password Error]:', error.message);
    return res.status(500).json({ success: false, error: error.message, message: 'Failed to configure password' });
  }
});

/**
 * POST /api/users/login-password
 * Authenticate existing user with email + password
 */
router.post('/login-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = normalizeEmail(email);

    console.log(`[MongoDB Password Login] Request received for: ${cleanEmail}`);

    if (!cleanEmail || !password) {
      return res.status(400).json({ success: false, message: 'Incorrect email or password.' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Unable to connect to CodeSaga. Please try again.' });
    }

    const user = await User.findOne({ email: cleanEmail }).select('+password_hash');

    console.log(`[MongoDB Password Login] User found: ${Boolean(user)}`);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Incorrect email or password.',
        message: 'Incorrect email or password.'
      });
    }

    if (!user.password_hash) {
      console.log(`[MongoDB Password Login] Password verification: failed (no password_hash configured)`);
      return res.status(401).json({ 
        success: false, 
        error: 'Password not configured. Please verify your email and create a password.',
        message: 'Password not configured. Please verify your email and create a password.',
        requiresOtpSetup: true
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log(`[MongoDB Password Login] Password verification: ${isMatch ? 'success' : 'failed'}`);

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

    return res.json({
      success: true,
      exists: true,
      user: userObj
    });
  } catch (error) {
    console.error('[MongoDB Password Login Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Incorrect email or password.', error: error.message });
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

    console.log(`[MongoDB User Login] Record login for: ${cleanEmail}`);

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

    return res.json({ success: true, exists: true, user: userObj });
  } catch (error) {
    console.error('[MongoDB User Login Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

/**
 * GET /api/users/:email/progress
 * Get progress stored in MongoDB
 */
router.get('/:email/progress', async (req, res) => {
  try {
    const cleanEmail = normalizeEmail(req.params.email);
    if (!cleanEmail || cleanEmail.includes('guest_')) {
      return res.json({ success: true, isGuest: true, progress: null });
    }

    console.log(`[MongoDB Progress Lookup] Fetch progress for: ${cleanEmail}`);

    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, offline: true, progress: null });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
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
    console.error('[MongoDB Progress Lookup Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch progress', error: error.message });
  }
});

/**
 * PUT /api/users/:email/progress
 * Update progress snapshot in MongoDB
 */
router.put('/:email/progress', async (req, res) => {
  try {
    const cleanEmail = normalizeEmail(req.params.email);
    if (!cleanEmail || cleanEmail.includes('guest_')) {
      return res.json({ success: true, isGuest: true, message: 'Guest progress ignored' });
    }

    console.log(`[MongoDB Progress Update] Updating progress for: ${cleanEmail}`);

    if (mongoose.connection.readyState !== 1) {
      console.warn('[MongoDB Progress Update] Database not connected. Progress not saved to cloud.');
      return res.json({ success: true, offline: true, message: 'Progress saved locally only' });
    }

    const progressData = req.body || {};
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

    if (progressData.sqlProgress) user.worldProgress.sqlProgress = { ...user.worldProgress.sqlProgress, ...progressData.sqlProgress };
    if (progressData.pythonProgress) user.worldProgress.pythonProgress = { ...user.worldProgress.pythonProgress, ...progressData.pythonProgress };
    if (progressData.javaProgress) user.worldProgress.javaProgress = { ...user.worldProgress.javaProgress, ...progressData.javaProgress };
    if (progressData.frontendProgress) user.worldProgress.frontendProgress = { ...user.worldProgress.frontendProgress, ...progressData.frontendProgress };
    if (progressData.cppProgress) user.worldProgress.cppProgress = { ...user.worldProgress.cppProgress, ...progressData.cppProgress };
    if (progressData.backendProgress) user.worldProgress.backendProgress = { ...user.worldProgress.backendProgress, ...progressData.backendProgress };

    if (progressData.certificates) {
      user.certificates = { ...user.certificates, ...progressData.certificates };
    }
    if (progressData.worldCertificates) {
      user.certificates.worldCertificates = { ...user.certificates.worldCertificates, ...progressData.worldCertificates };
    }

    user.markModified('worldProgress');
    user.markModified('certificates');

    await user.save();
    console.log(`[MongoDB Progress Update] Successfully saved progress for ${cleanEmail} (XP: ${user.xp}, Level: ${user.level})`);

    return res.json({
      success: true,
      message: 'Progress updated successfully in MongoDB Atlas (codesaga_users)'
    });
  } catch (error) {
    console.error('[MongoDB Progress Update Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update progress', error: error.message });
  }
});

/**
 * PUT /api/users/:email/certificate
 * Save or update certificate details
 */
router.put('/:email/certificate', async (req, res) => {
  try {
    const cleanEmail = normalizeEmail(req.params.email);
    if (!cleanEmail || cleanEmail.includes('guest_')) {
      return res.json({ success: true, isGuest: true });
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
      const currentCerts = user.certificates?.worldCertificates || {};
      const newCert = {
        id: certificateId,
        issued_at: certificateIssuedAt || new Date().toISOString(),
        world_id: worldId
      };

      user.certificates.worldCertificates = {
        ...currentCerts,
        [worldId]: newCert
      };
    } else {
      user.certificates.certificateIssued = true;
      if (certificateId) user.certificates.certificateId = certificateId;
      if (certificateIssuedAt) user.certificates.certificateIssuedAt = certificateIssuedAt;
      if (certificateName) user.certificates.certificateName = certificateName;
    }

    user.markModified('certificates');
    await user.save();

    return res.json({
      success: true,
      certificates: user.certificates
    });
  } catch (error) {
    console.error('[MongoDB Certificate Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update certificate', error: error.message });
  }
});

export default router;
