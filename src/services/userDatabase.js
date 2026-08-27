/**
 * CodeSaga Database API Service (MongoDB Atlas via Express API)
 * -------------------------------------------------------------
 * Centralizes all fetch communication with the Node.js + Express backend.
 * Enforces lowercased email identity (email.trim().toLowerCase()).
 */

import {
  getUserFromApi,
  registerUserInApi,
  recordUserLoginInApi,
  saveUserProgressToApi,
  debouncedSaveProgressToApi,
  flushPendingProgressSaveToApi,
  saveCertificateToApi
} from './apiService';

export function getApiUrl() {
  return import.meta.env.VITE_API_BASE_URL || 'https://codesaga-app-3.onrender.com';
}

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

/**
 * 1. GET USER BY EMAIL — Reads user account from MongoDB via Express API
 */
export async function getUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || normalizedEmail.includes('guest_')) {
    return { success: true, exists: false, isGuest: true };
  }

  const res = await getUserFromApi(normalizedEmail);
  if (res && res.success && res.user) {
    // Map backend user to expected store shape
    const u = res.user;
    return {
      success: true,
      exists: true,
      user: {
        ...u,
        id: u.userId || u.id,
        name: u.username || u.name,
        role: u.role || 'user'
      },
      progress: {
        xp: u.xp,
        level: u.level,
        coins: u.coins,
        streak: u.streak,
        completedMissions: u.completedMissions || [],
        completedChapters: u.completedChapters || [],
        unlockedChapters: u.unlockedChapters || [1],
        currentWorld: u.currentWorld || 'sql',
        earnedAchievements: u.earnedAchievements || [],
        sqlProgress: u.worldProgress?.sqlProgress,
        pythonProgress: u.worldProgress?.pythonProgress,
        javaProgress: u.worldProgress?.javaProgress,
        frontendProgress: u.worldProgress?.frontendProgress,
        cppProgress: u.worldProgress?.cppProgress,
        backendProgress: u.worldProgress?.backendProgress,
        certificates: u.certificates
      }
    };
  }

  return res;
}

/**
 * 2. REGISTER USER — Add/register user in MongoDB via Express API
 */
export async function registerUser(email, username) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || normalizedEmail.includes('guest_')) {
    return { success: true, isGuest: true };
  }

  return await registerUserInApi(normalizedEmail, username);
}

/**
 * 3. UPDATE LAST LOGIN — Update user's last login timestamp in MongoDB
 */
export async function updateLastLogin(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || normalizedEmail.includes('guest_')) {
    return { success: true, isGuest: true };
  }

  return await recordUserLoginInApi(normalizedEmail);
}

/**
 * 4. UPDATE PROGRESS — Persist user progress to MongoDB via Express API
 */
export async function updateProgress(email, progressData = {}) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || normalizedEmail.includes('guest_') || progressData.isGuest) {
    return { success: true, isGuest: true };
  }

  return await saveUserProgressToApi(normalizedEmail, progressData);
}

/**
 * 5. ISSUE CERTIFICATE — Issue or retrieve certificate in MongoDB
 */
export async function issueCertificate(email, certificateData = {}) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || normalizedEmail.includes('guest_') || certificateData.isGuest) {
    return { success: false, error: 'Guests cannot claim certificates' };
  }

  return await saveCertificateToApi(normalizedEmail, {
    certificateId: certificateData.certificateId || certificateData.certificate_id,
    certificateIssuedAt: certificateData.certificateIssuedAt || certificateData.certificate_issued_at,
    username: certificateData.username || certificateData.name
  });
}

/**
 * 6. ISSUE WORLD CERTIFICATE — Issue or retrieve 6 world certificates independently
 */
export async function issueWorldCertificate(email, worldId) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || normalizedEmail.includes('guest_')) {
    return { success: false, error: 'Guests cannot claim real certificates' };
  }

  const worldPrefixMap = { sql: 'W1', python: 'W2', java: 'W3', frontend: 'W4', cpp: 'W5', backend: 'W6' };
  const wPrefix = worldPrefixMap[worldId] || 'W1';
  const year = new Date().getFullYear();
  const randHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  const certId = `CS-${wPrefix}-${randHex}`;
  const certIssuedAt = new Date().toISOString();

  return await saveCertificateToApi(normalizedEmail, {
    worldId: worldId || 'sql',
    certificateId: certId,
    certificateIssuedAt: certIssuedAt
  });
}

/**
 * DEBOUNCED PROGRESS SAVE MECHANISM
 */
export function debouncedSaveProgress(email, progressData, delayMs = 1500) {
  return debouncedSaveProgressToApi(email, progressData, delayMs);
}

export function flushPendingProgressSave() {
  return flushPendingProgressSaveToApi();
}
