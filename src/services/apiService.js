/**
 * CodeSaga Frontend API Service
 * -------------------------------------------------------------
 * Communicates with the Node.js + Express backend API connected to MongoDB Atlas.
 * Never connects React/Vite directly to MongoDB and never exposes credentials.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://codesaga-app-3.onrender.com';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

/**
 * Resilient fetch helper with automatic retry for server cold starts (Render/MongoDB)
 */
async function fetchWithRetry(url, options = {}, retries = 3, delayMs = 1500) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
}

/**
 * Fetch user account from MongoDB via Express API
 */
export async function getUserFromApi(email) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || cleanEmail.includes('guest_')) {
    return { success: true, exists: false, isGuest: true, hasPassword: false };
  }

  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/users/${encodeURIComponent(cleanEmail)}`);
    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error in getUserFromApi:', error);
    return { success: false, offline: true, message: error.message };
  }
}

/**
 * Register a new user in MongoDB via Express API (with optional password)
 */
export async function registerUserInApi(email, username, role = 'user', password = null) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || cleanEmail.includes('guest_')) {
    return { success: true, isGuest: true };
  }

  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, username, role, password })
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || `Server error (${res.status})` };
    }
    return data;
  } catch (error) {
    console.error('Error in registerUserInApi:', error);
    return { success: false, offline: true, message: error.message };
  }
}

/**
 * Authenticate existing user with Email + Password via Express API
 */
export async function loginWithPasswordApi(email, password) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || !password) {
    return { success: false, message: 'Incorrect email or password.' };
  }

  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/users/login-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password })
    });
    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = { message: 'Incorrect email or password.' };
    }
    if (!res.ok) {
      return { 
        success: false, 
        message: data.error || data.message || 'Incorrect email or password.',
        requiresOtpSetup: Boolean(data.requiresOtpSetup)
      };
    }
    return data;
  } catch (error) {
    console.error('Error in loginWithPasswordApi:', error);
    return { success: false, offline: true, message: 'Unable to connect to CodeSaga backend. Please try again.' };
  }
}

/**
 * Configure CodeSaga Password for verified user email via Express API
 */
export async function setPasswordApi(email, password) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || !password) {
    return { success: false, message: 'Password is required.' };
  }

  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/users/set-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password })
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || 'Failed to save password.' };
    }
    return data;
  } catch (error) {
    console.error('Error in setPasswordApi:', error);
    return { success: false, offline: true, message: 'Unable to connect to CodeSaga backend. Please try again.' };
  }
}

/**
 * Record user login timestamp in MongoDB via Express API
 */
export async function recordUserLoginInApi(email) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || cleanEmail.includes('guest_')) {
    return { success: true, isGuest: true };
  }

  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail })
    });
    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error in recordUserLoginInApi:', error);
    return { success: false, offline: true, message: error.message };
  }
}

/**
 * Fetch progress from MongoDB via Express API
 */
export async function getUserProgressFromApi(email) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || cleanEmail.includes('guest_')) {
    return { success: true, isGuest: true, progress: null };
  }

  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/users/${encodeURIComponent(cleanEmail)}/progress`);
    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error in getUserProgressFromApi:', error);
    return { success: false, offline: true, message: error.message };
  }
}

/**
 * Save user progress snapshot to MongoDB via Express API
 */
export async function saveUserProgressToApi(email, progressData) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || cleanEmail.includes('guest_') || progressData?.isGuest) {
    return { success: true, isGuest: true };
  }

  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/users/${encodeURIComponent(cleanEmail)}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progressData)
    });
    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error in saveUserProgressToApi:', error);
    return { success: false, offline: true, message: error.message };
  }
}

/**
 * Debounced progress save helper
 */
let debounceTimer = null;
let pendingSave = null;

export function debouncedSaveProgressToApi(email, progressData, delayMs = 1500) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || cleanEmail.includes('guest_') || progressData?.isGuest) {
    return;
  }

  pendingSave = { email: cleanEmail, progressData };

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(async () => {
    if (pendingSave) {
      const { email: targetEmail, progressData: targetData } = pendingSave;
      pendingSave = null;
      await saveUserProgressToApi(targetEmail, targetData);
    }
  }, delayMs);
}

/**
 * Flush any pending debounced progress save immediately (e.g. on logout/page unload)
 */
export async function flushPendingProgressSaveToApi() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  if (pendingSave) {
    const { email: targetEmail, progressData: targetData } = pendingSave;
    pendingSave = null;
    return await saveUserProgressToApi(targetEmail, targetData);
  }
  return { success: true };
}

/**
 * Issue or update certificate in MongoDB via Express API
 */
export async function saveCertificateToApi(email, certPayload) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || cleanEmail.includes('guest_')) {
    return { success: true, isGuest: true };
  }

  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/users/${encodeURIComponent(cleanEmail)}/certificate`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certPayload)
    });
    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error in saveCertificateToApi:', error);
    return { success: false, offline: true, message: error.message };
  }
}
