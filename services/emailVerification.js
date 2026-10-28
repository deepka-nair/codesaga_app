import crypto from 'node:crypto';

const normalize = value => String(value || '').trim().toLowerCase();
export const validEmail = value => value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const hash = value => crypto.createHash('sha256').update(value).digest();

export async function deliverVerificationEmail(email, code) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.OTP_FROM_EMAIL;
  if (!key || !from) throw new Error('OTP_DELIVERY_NOT_CONFIGURED');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST', signal: AbortSignal.timeout(10000),
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [email], subject: 'Your CodeSaga verification code',
      text: `Your CodeSaga code is ${code}. It expires in five minutes. If you did not request this code, ignore this email.` })
  });
  if (!response.ok) throw new Error('OTP_DELIVERY_FAILED');
}

// Single-process store. Expiry/restart fails closed. Multiple API instances need a shared store.
export function createEmailVerification({ deliver = deliverVerificationEmail, now = Date.now,
  randomCode = () => String(crypto.randomInt(0, 1000000)).padStart(6, '0') } = {}) {
  const codes = new Map();
  const grants = new Map();
  const sent = new Map();
  const expiry = 5 * 60 * 1000;
  const prune = () => {
    for (const map of [codes, grants]) for (const [key, value] of map) if (value.expiresAt <= now()) map.delete(key);
    for (const [key, timestamp] of sent) if (now() - timestamp >= 60000) sent.delete(key);
  };
  return {
    async send(input) {
      const email = normalize(input); prune();
      if (!validEmail(email)) return { status: 400, success: false, message: 'Enter a valid email address.' };
      if (sent.has(email)) return { status: 429, success: false, message: 'Wait one minute before requesting another code.' };
      if (codes.size + grants.size >= 10000 || sent.size >= 10000) return { status: 503, success: false, message: 'Verification temporarily unavailable.' };
      const code = randomCode();
      const salt = crypto.randomBytes(16).toString('hex');
      sent.set(email, now());
      codes.set(email, { digest: hash(salt + code), salt, attempts: 3, expiresAt: now() + expiry });
      try { await deliver(email, code); }
      catch { codes.delete(email); return { status: 503, success: false, message: 'Verification email is unavailable. Please contact support or use password login.' }; }
      return { status: 200, success: true, message: 'Verification code sent. Check your email.' };
    },
    verify(input, value) {
      const email = normalize(input); prune();
      const record = codes.get(email);
      const code = String(value || '').trim();
      if (!record || !/^\d{6}$/.test(code)) return { status: 401, success: false, message: 'Invalid or expired verification code.' };
      record.attempts--;
      const matches = crypto.timingSafeEqual(record.digest, hash(record.salt + code));
      if (!matches) {
        if (record.attempts <= 0) codes.delete(email);
        return { status: 401, success: false, message: 'Invalid or expired verification code.' };
      }
      codes.delete(email);
      const verificationToken = crypto.randomBytes(32).toString('base64url');
      grants.set(hash(verificationToken).toString('hex'), { email, expiresAt: now() + expiry });
      return { status: 200, success: true, verificationToken, message: 'Email ownership verified.' };
    },
    consume(token, input) {
      if (typeof token !== 'string' || token.length !== 43) return false;
      prune();
      const key = hash(token).toString('hex');
      const grant = grants.get(key);
      if (!grant || grant.email !== normalize(input)) return false;
      grants.delete(key);
      return true;
    }
  };
}
export const emailVerification = createEmailVerification();
