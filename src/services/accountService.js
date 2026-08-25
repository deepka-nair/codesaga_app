// CodeSaga Account & Session Management Service
// -------------------------------------------------------------
// Manages normalized email identities (email.trim().toLowerCase()),
// persistent account verification, per-account progress isolation,
// and MongoDB Atlas backend synchronization.

import { 
  registerUserInApi, 
  saveUserProgressToApi,
  getUserFromApi 
} from './apiService';

const ACCOUNTS_KEY = 'codesaga_verified_accounts';
const LAST_EMAIL_KEY = 'codesaga_last_active_email';

/**
 * Enforce consistent lowercased and trimmed email identity
 */
export function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Get list of verified account emails stored on this device
 */
export function getVerifiedAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read verified accounts:', e);
    return [];
  }
}

/**
 * Check whether an email is a registered and verified account
 */
export function isAccountVerified(email) {
  const norm = normalizeEmail(email);
  if (!norm) return false;
  const accounts = getVerifiedAccounts();
  return accounts.includes(norm);
}

/**
 * Register an email as a verified account locally and trigger MongoDB backend creation
 */
export function registerAccount(email) {
  const norm = normalizeEmail(email);
  if (!norm || norm.includes('guest_')) return;

  const accounts = getVerifiedAccounts();
  if (!accounts.includes(norm)) {
    accounts.push(norm);
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save verified account:', e);
    }
  }
  setLastActiveEmail(norm);

  // Non-blocking MongoDB backend registration
  registerUserInApi(norm).catch((err) => {
    console.warn('Background MongoDB registration error:', err);
  });
}

/**
 * Get the last active verified email
 */
export function getLastActiveEmail() {
  try {
    const email = localStorage.getItem(LAST_EMAIL_KEY);
    return email ? normalizeEmail(email) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Update the last active verified email
 */
export function setLastActiveEmail(email) {
  const norm = normalizeEmail(email);
  try {
    if (norm) {
      localStorage.setItem(LAST_EMAIL_KEY, norm);
    } else {
      localStorage.removeItem(LAST_EMAIL_KEY);
    }
  } catch (e) {
    console.error('Failed to set last active email:', e);
  }
}

/**
 * Generate local storage key for per-account user progress
 */
export function getAccountProgressKey(email) {
  const norm = normalizeEmail(email);
  return `codesaga_user_progress_${norm}`;
}

/**
 * Synchronously load saved account progress from browser storage
 */
export function loadLocalAccountProgress(email) {
  const norm = normalizeEmail(email);
  if (!norm) return null;
  const key = getAccountProgressKey(norm);
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to load local account progress:', e);
    return null;
  }
}

/**
 * Synchronously save progress snapshot for a specific account to browser storage
 */
export function saveLocalAccountProgress(email, progress) {
  const norm = normalizeEmail(email);
  if (!norm) return;
  const key = getAccountProgressKey(norm);
  try {
    const currentSave = loadLocalAccountProgress(norm) || {};
    localStorage.setItem(key, JSON.stringify({
      ...currentSave,
      ...progress
    }));
  } catch (e) {
    console.error('Failed to save local account progress:', e);
  }
}

/**
 * Save user progress locally and trigger non-blocking MongoDB backend sync
 */
export function saveAccountProgress(email, progress) {
  const norm = normalizeEmail(email);
  if (!norm || norm.includes('guest_')) return;

  saveLocalAccountProgress(norm, progress);

  // Background non-blocking MongoDB sync
  try {
    saveUserProgressToApi(norm, progress).catch((err) => {
      console.warn('Background MongoDB sync error:', err);
    });
  } catch (e) {
    // Ignore synchronous initiation errors
  }
}

/**
 * Non-blocking cloud progress load from Express API with timeout
 */
export async function fetchCloudProgressWithTimeout(email, timeoutMs = 1000) {
  const norm = normalizeEmail(email);
  if (!norm || norm.includes('guest_')) return null;

  try {
    const cloudPromise = getUserFromApi(norm).then((res) => {
      if (res && res.success && res.user) {
        return {
          user_id: res.user.userId || res.user.id,
          xp: res.user.xp,
          level: res.user.level,
          completed_missions: res.user.completedMissions,
          completed_chapters: res.user.completedChapters,
          current_world: res.user.currentWorld,
          certificates: res.user.certificates
        };
      }
      return null;
    });
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs));
    return await Promise.race([cloudPromise, timeoutPromise]);
  } catch (e) {
    return null;
  }
}
