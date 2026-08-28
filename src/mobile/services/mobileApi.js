/**
 * CodeSaga Expo Mobile API Service
 * -------------------------------------------------------------
 * Communicates exclusively with the production Express + MongoDB backend.
 * Production API Base URL: https://codesaga-app-3.onrender.com
 */

const API_BASE_URL = 'https://codesaga-app-3.onrender.com';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

/**
 * Resilient fetch helper with timeout and automatic retry logic
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
 * 1. GET USER BY EMAIL — Check account existence & password requirement
 */
export async function getUserFromApi(email) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || cleanEmail.includes('guest_')) {
    return { success: true, exists: false, isGuest: true, hasPassword: false };
  }

  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/users/${encodeURIComponent(cleanEmail)}`);
    if (!res.ok) {
      return { success: false, message: `Server error (${res.status})` };
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('[Mobile API] getUserFromApi error:', error);
    return { success: false, offline: true, message: 'Unable to reach CodeSaga server. Check connection.' };
  }
}

/**
 * 2. REGISTER NEW USER — Register user in MongoDB Atlas
 */
export async function registerUserInApi(email, username, password = null) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || cleanEmail.includes('guest_')) {
    return { success: true, isGuest: true };
  }

  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || `Server error (${res.status})` };
    }
    return data;
  } catch (error) {
    console.error('[Mobile API] registerUserInApi error:', error);
    return { success: false, offline: true, message: 'Unable to connect to CodeSaga backend.' };
  }
}

/**
 * 3. LOGIN WITH PASSWORD — Authenticate against backend bcrypt password hash
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
    console.error('[Mobile API] loginWithPasswordApi error:', error);
    return { success: false, offline: true, message: 'Unable to connect to CodeSaga backend server.' };
  }
}

/**
 * 4. SET PASSWORD — Set or reset password in MongoDB Atlas
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
    console.error('[Mobile API] setPasswordApi error:', error);
    return { success: false, offline: true, message: 'Unable to connect to CodeSaga server.' };
  }
}

/**
 * 5. GET USER PROGRESS — Retrieve progress snapshot from MongoDB Atlas
 */
export async function getUserProgressFromApi(email) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || cleanEmail.includes('guest_')) {
    return { success: true, isGuest: true, progress: null };
  }

  try {
    const res = await fetchWithRetry(`${API_BASE_URL}/api/users/${encodeURIComponent(cleanEmail)}/progress`);
    if (!res.ok) {
      return { success: false, message: `Server error (${res.status})` };
    }
    return await res.json();
  } catch (error) {
    console.error('[Mobile API] getUserProgressFromApi error:', error);
    return { success: false, offline: true, message: 'Unable to fetch progress from server.' };
  }
}

/**
 * 6. SAVE USER PROGRESS — Save full progress snapshot to MongoDB Atlas
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
      return { success: false, message: `Server error (${res.status})` };
    }
    return await res.json();
  } catch (error) {
    console.error('[Mobile API] saveUserProgressToApi error:', error);
    return { success: false, offline: true, message: 'Unable to sync progress with cloud.' };
  }
}

/**
 * 7. SAVE CERTIFICATE — Save world or main certificate to MongoDB Atlas
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
      return { success: false, message: `Server error (${res.status})` };
    }
    return await res.json();
  } catch (error) {
    console.error('[Mobile API] saveCertificateToApi error:', error);
    return { success: false, offline: true, message: 'Unable to save certificate.' };
  }
}

export { API_BASE_URL };
