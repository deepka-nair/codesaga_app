import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Server-side OTP memory store
const activeOtpStore = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 3;

function generate6DigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function otpApiPlugin(env) {
  return {
    name: 'otp-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        // API Endpoint: /api/send-otp
        if (req.method === 'POST' && url === '/api/send-otp') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { email } = JSON.parse(body || '{}');
              if (!email || !email.includes('@')) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, message: 'Please enter a valid email address.' }));
              }

              const normalizedEmail = email.trim().toLowerCase();
              const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY;

              if (!apiKey) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ 
                  success: false, 
                  message: 'Server error — RESEND_API_KEY environment variable is not configured.' 
                }));
              }

              const code = generate6DigitCode();
              const now = Date.now();

              activeOtpStore.set(normalizedEmail, {
                code,
                expiresAt: now + OTP_EXPIRY_MS,
                attemptsLeft: MAX_ATTEMPTS,
                createdAt: now
              });

              // Call Resend API directly from server side using server-side API Key
              const resendRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  from: 'CodeSaga <onboarding@resend.dev>',
                  to: [normalizedEmail],
                  subject: 'Your CodeSaga Email Verification Code 🔑',
                  html: `
                    <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #0e2526; color: #f6f4eb; border-radius: 8px;">
                      <h2 style="color: #e6a93d; margin-top: 0;">CodeSaga Verification Code</h2>
                      <p>Your 6-digit one-time verification code is:</p>
                      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #38bdf8; padding: 14px 20px; background: #071516; border-radius: 6px; display: inline-block; border: 1px solid #2a5a5c;">
                        ${code}
                      </div>
                      <p style="font-size: 13px; color: #a8b8b4; margin-top: 20px;">This code is valid for 5 minutes. Do not share this code with anyone.</p>
                    </div>
                  `
                })
              });

              const resData = await resendRes.json();
              if (resendRes.ok && resData.id) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ 
                  success: true, 
                  message: `OTP sent ✓ Verification code dispatched to ${normalizedEmail}.` 
                }));
              } else {
                activeOtpStore.delete(normalizedEmail);
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ 
                  success: false, 
                  message: `Unable to send OTP — ${resData.message || 'Resend API rejected email dispatch.'}` 
                }));
              }
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, message: 'Server error processing OTP dispatch.' }));
            }
          });
          return;
        }

        // API Endpoint: /api/verify-otp
        if (req.method === 'POST' && url === '/api/verify-otp') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { email, code } = JSON.parse(body || '{}');
              if (!email || !code) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, message: 'Email address and 6-digit OTP code are required.' }));
              }

              const normalizedEmail = email.trim().toLowerCase();
              const record = activeOtpStore.get(normalizedEmail);

              if (!record) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ 
                  success: false, 
                  message: 'Unable to verify — No active OTP request found for this email. Please click Resend OTP.' 
                }));
              }

              if (Date.now() > record.expiresAt) {
                activeOtpStore.delete(normalizedEmail);
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ 
                  success: false, 
                  message: 'Expired OTP — Verification code has expired. Please click Resend OTP.' 
                }));
              }

              if (record.attemptsLeft <= 0) {
                activeOtpStore.delete(normalizedEmail);
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ 
                  success: false, 
                  message: 'Expired OTP — Maximum verification attempts exceeded. Please request a new code.' 
                }));
              }

              if (record.code === String(code).trim()) {
                activeOtpStore.delete(normalizedEmail);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ 
                  success: true, 
                  message: 'OTP verified ✓' 
                }));
              }

              record.attemptsLeft -= 1;
              activeOtpStore.set(normalizedEmail, record);

              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ 
                success: false, 
                message: `Invalid OTP — Verification code is incorrect. ${record.attemptsLeft} attempt(s) remaining.` 
              }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, message: 'Server error processing OTP verification.' }));
            }
          });
          return;
        }

        next();
      });
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), otpApiPlugin(env)]
  };
});
