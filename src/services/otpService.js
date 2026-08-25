// CodeSaga EmailJS OTP Service
// -------------------------------------------------------------
// Dispatches 6-digit verification codes using official EmailJS REST API (https://api.emailjs.com/api/v1.0/email/send).
// Environment variables: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY.

const activeOtpStore = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 Minutes
const MAX_ATTEMPTS = 3;

function generate6DigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send 6-digit OTP code to user's email via EmailJS API
 */
export async function sendEmailOTP(email) {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  const normalizedEmail = email.trim().toLowerCase();

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_z7eq9z7";
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_1fq9xou";
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "mnDSxXqjV8UOZEA0Y";


  if (!serviceId || !templateId || !publicKey) {
    return {
      success: false,
      configured: false,
      message: 'EmailJS environment variables (VITE_EMAILJS_SERVICE_ID, etc.) are missing from .env.'
    };
  }

  const code = generate6DigitCode();
  const now = Date.now();

  // Store active OTP record in memory
  activeOtpStore.set(normalizedEmail, {
    code,
    expiresAt: now + OTP_EXPIRY_MS,
    attemptsLeft: MAX_ATTEMPTS,
    createdAt: now
  });

  try {
    // Send email via EmailJS REST API
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          email: normalizedEmail,
          otp: code,
          to_email: normalizedEmail
        }
      })
    });

    if (response.ok || response.status === 200) {
      return {
        success: true,
        message: `OTP sent successfully to ${normalizedEmail}.`
      };
    } else {
      const errorText = await response.text();
      console.error('EmailJS Error Response:', errorText);
      return {
        success: false,
        message: `Unable to send OTP. Please check your email address and try again. (${response.status})`
      };
    }
  } catch (err) {
    console.error('EmailJS Network Error:', err);
    return {
      success: false,
      message: 'Unable to send OTP. Please check your network connection and try again.'
    };
  }
}

/**
 * Verify submitted OTP code against active in-memory record
 */
export async function verifyEmailOTP(email, inputCode) {
  if (!email || !inputCode) {
    return { success: false, message: 'Email address and 6-digit OTP code are required.' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const record = activeOtpStore.get(normalizedEmail);

  if (!record) {
    return {
      success: false,
      message: 'Unable to verify — No active OTP request found for this email. Please click Resend OTP.'
    };
  }

  if (Date.now() > record.expiresAt) {
    activeOtpStore.delete(normalizedEmail);
    return {
      success: false,
      message: 'Expired OTP — Verification code has expired. Please click Resend OTP.'
    };
  }

  if (record.attemptsLeft <= 0) {
    activeOtpStore.delete(normalizedEmail);
    return {
      success: false,
      message: 'Expired OTP — Maximum verification attempts exceeded. Please request a new code.'
    };
  }

  if (record.code === String(inputCode).trim()) {
    activeOtpStore.delete(normalizedEmail);
    return {
      success: true,
      message: 'OTP verified ✓'
    };
  }

  record.attemptsLeft -= 1;
  activeOtpStore.set(normalizedEmail, record);

  return {
    success: false,
    message: `Invalid OTP — Verification code is incorrect. ${record.attemptsLeft} attempt(s) remaining.`
  };
}
