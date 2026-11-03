// Codes and ownership verification are handled exclusively by the backend.
// The short-lived single-use ownership grant stays in memory, never localStorage.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://codesaga-app-3.onrender.com';
const grants = new Map();
export function takeEmailVerificationToken(email) {
  const key = String(email || '').trim().toLowerCase();
  const token = grants.get(key); grants.delete(key); return token;
}
async function request(path, body) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/otp/${path}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body), signal: AbortSignal.timeout(15000)
    });
    return await res.json();
  } catch { return { success: false, message: 'Unable to reach verification service. Try again or use password login.' }; }
}
export async function sendEmailOTP(email) {
  grants.delete(String(email || '').trim().toLowerCase());
  return request('send', { email });
}
export async function verifyEmailOTP(email, code) {
  const result = await request('verify', { email, code });
  if (result.success && result.verificationToken) grants.set(String(email).trim().toLowerCase(), result.verificationToken);
  return result;
}
