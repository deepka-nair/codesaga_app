import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPanel from '../components/PixelPanel';
import GameButton from '../components/GameButton';
import audioManager from '../services/audioManager';
import useStore from '../store/useStore';
import { sendEmailOTP, verifyEmailOTP } from '../services/otpService';
import { 
  getUserFromApi, 
  registerUserInApi, 
  loginWithPasswordApi,
  setPasswordApi,
  recordUserLoginInApi 
} from '../services/apiService';
import { 
  normalizeEmail,
  getLastActiveEmail, 
  isAccountVerified, 
  registerAccount 
} from '../services/accountService';

const validatePasswordClient = (pass, confirmPass) => {
  if (!pass || pass.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[a-zA-Z]/.test(pass)) {
    return { valid: false, message: 'Password must contain at least one letter.' };
  }
  if (!/[0-9]/.test(pass)) {
    return { valid: false, message: 'Password must contain at least one number.' };
  }
  if (confirmPass !== undefined && pass !== confirmPass) {
    return { valid: false, message: 'Passwords do not match.' };
  }
  return { valid: true };
};

const Login = () => {
  const navigate = useNavigate();
  const { login, loginGuest, user, isGuest } = useStore();
  
  // Account mode: 'returning' or 'new'
  const savedLastEmail = getLastActiveEmail();
  const hasReturningAccount = savedLastEmail && isAccountVerified(savedLastEmail);
  const [mode, setMode] = useState(hasReturningAccount ? 'returning' : 'new');
  const [returningEmail, setReturningEmail] = useState(savedLastEmail || '');

  // Auth method: 'password' (default) or 'otp'
  const [authMethod, setAuthMethod] = useState('password');

  // Step state: 'login', 'email', 'otp', 'username', or 'create_password'
  const [step, setStep] = useState(hasReturningAccount ? 'login' : 'login');
  const [email, setEmail] = useState(savedLastEmail || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [username, setUsername] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [pendingExistingUser, setPendingExistingUser] = useState(null);
  
  // UI status states
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success'|'error'|'info', text: string }

  // Resend cooldown timer (30 seconds)
  const [cooldown, setCooldown] = useState(0);

  // Redirect if already authenticated or in guest mode
  useEffect(() => {
    if (user || isGuest) {
      navigate('/worlds', { replace: true });
    }
  }, [user, isGuest, navigate]);

  // Cooldown countdown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle direct password login
  const handlePasswordLogin = async (e) => {
    if (e) e.preventDefault();
    setStatusMessage(null);

    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail || !cleanEmail.includes('@')) {
      audioManager.playError();
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (!password) {
      audioManager.playError();
      setStatusMessage({ type: 'error', text: 'Please enter your password.' });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: 'info', text: 'Authenticating with CodeSaga... ⏳' });
    audioManager.playClick();

    const res = await loginWithPasswordApi(cleanEmail, password);
    setLoading(false);

    if (res.success && res.user) {
      audioManager.playSuccess();
      registerAccount(cleanEmail);
      recordUserLoginInApi(cleanEmail);

      const loadedUser = res.user;
      const sessionObj = {
        userId: loadedUser.userId || loadedUser.id || 'USR_EXISTS',
        email: cleanEmail,
        username: loadedUser.username || cleanEmail.split('@')[0]
      };
      localStorage.setItem("codesaga_session", JSON.stringify(sessionObj));

      login(
        { email: cleanEmail, name: sessionObj.username, id: sessionObj.userId, authProvider: 'password' },
        loadedUser
      );
      
      navigate('/worlds');
    } else {
      audioManager.playError();
      if (res.requiresOtpSetup) {
        setStatusMessage({
          type: 'error',
          text: 'Password not configured for this account. Please verify via Email OTP to set your password.'
        });
        setAuthMethod('otp');
        setStep('email');
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Incorrect email or password.'
        });
      }
    }
  };

  // Step 1: Send Email OTP via EmailJS
  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setStatusMessage(null);

    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail || !cleanEmail.includes('@')) {
      audioManager.playError();
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: 'info', text: 'Sending OTP... 📩 Dispatching EmailJS OTP' });
    audioManager.playNotification();

    const res = await sendEmailOTP(cleanEmail);
    setLoading(false);

    if (res.success) {
      audioManager.playSuccess();
      setStep('otp');
      setStatusMessage({ type: 'success', text: res.message });
      setCooldown(30);
    } else {
      audioManager.playError();
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  // Step 2: Verify Submitted Email OTP Code
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    const cleanEmail = normalizeEmail(email);
    if (!otpCode || otpCode.trim().length !== 6) {
      audioManager.playError();
      setStatusMessage({ type: 'error', text: 'Invalid OTP — Please enter the 6-digit verification code.' });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: 'info', text: 'Verifying code... ⏳' });
    audioManager.playClick();

    const res = await verifyEmailOTP(cleanEmail, otpCode);

    if (res.success) {
      audioManager.playSuccess();
      setStatusMessage({ type: 'info', text: 'Checking database... ⏳' });

      // Check if user exists in MongoDB Atlas via GET /api/users/:email
      const dbRes = await getUserFromApi(cleanEmail);
      setLoading(false);

      if (dbRes.success && dbRes.exists && dbRes.user) {
        registerAccount(cleanEmail);
        setPendingExistingUser(dbRes.user);

        if (isForgotPassword || !dbRes.hasPassword) {
          // EXISTING USER WITHOUT PASSWORD OR FORGOT PASSWORD: Move to Step 'create_password'
          setStep('create_password');
          setStatusMessage({
            type: 'info',
            text: isForgotPassword ? 'Create a new password for your CodeSaga account.' : 'Create your CodeSaga password.'
          });
        } else {
          // EXISTING USER WITH PASSWORD: log in immediately
          recordUserLoginInApi(cleanEmail);
          const loadedUser = dbRes.user;
          const sessionObj = {
            userId: loadedUser.userId || loadedUser.id || 'USR_EXISTS',
            email: cleanEmail,
            username: loadedUser.username || cleanEmail.split('@')[0]
          };
          localStorage.setItem("codesaga_session", JSON.stringify(sessionObj));

          login(
            { email: cleanEmail, name: sessionObj.username, id: sessionObj.userId, authProvider: 'emailjs_otp' },
            loadedUser
          );
          
          navigate('/worlds');
        }
      } else if (dbRes.success && !dbRes.exists) {
        // NEW USER: Move to Step 3 (Username creation)
        registerAccount(cleanEmail);
        setUsername(cleanEmail.split('@')[0]);
        setStep('username');
        setStatusMessage(null);
      } else {
        audioManager.playError();
        setStatusMessage({ 
          type: 'error', 
          text: dbRes.error || "Unable to connect to CodeSaga's database. Please try again." 
        });
      }
    } else {
      setLoading(false);
      audioManager.playError();
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  // Step 3: Username Setup for New Users
  const handleCreateUsername = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    const cleanUsername = username.trim();
    if (!cleanUsername || cleanUsername.length < 2) {
      audioManager.playError();
      setStatusMessage({ type: 'error', text: 'Please enter a valid detective username (min 2 chars).' });
      return;
    }

    // Move to Password creation step for new user
    setStep('create_password');
    setStatusMessage(null);
  };

  // Step 4: Create / Save Password Handler
  const handleSavePassword = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    const cleanEmail = normalizeEmail(email);
    const passVal = validatePasswordClient(password, confirmPassword);
    if (!passVal.valid) {
      audioManager.playError();
      setStatusMessage({ type: 'error', text: passVal.message });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: 'info', text: 'Saving password securely to MongoDB Atlas... ⏳' });
    audioManager.playClick();

    if (pendingExistingUser) {
      // Existing user configuring / resetting password
      const setRes = await setPasswordApi(cleanEmail, password);
      setLoading(false);

      if (setRes.success) {
        audioManager.playSuccess();
        recordUserLoginInApi(cleanEmail);

        const loadedUser = setRes.user || pendingExistingUser;
        const sessionObj = {
          userId: loadedUser.userId || loadedUser.id || 'USR_EXISTS',
          email: cleanEmail,
          username: loadedUser.username || cleanEmail.split('@')[0]
        };
        localStorage.setItem("codesaga_session", JSON.stringify(sessionObj));

        login(
          { email: cleanEmail, name: sessionObj.username, id: sessionObj.userId, authProvider: 'password_set' },
          loadedUser
        );

        navigate('/worlds');
      } else {
        audioManager.playError();
        setStatusMessage({ type: 'error', text: setRes.message || 'Failed to save password.' });
      }
    } else {
      // New user registering account with username + password
      const cleanUsername = username.trim() || cleanEmail.split('@')[0];
      const regRes = await registerUserInApi(cleanEmail, cleanUsername, 'user', password);
      setLoading(false);

      if (regRes.success) {
        audioManager.playSuccess();
        const newUser = regRes.user || {};
        const userId = newUser.userId || newUser.id || ('USR_' + Date.now().toString(36).toUpperCase());
        const sessionObj = {
          userId,
          email: cleanEmail,
          username: cleanUsername
        };

        localStorage.setItem("codesaga_session", JSON.stringify(sessionObj));

        login(
          { email: cleanEmail, name: cleanUsername, id: userId, authProvider: 'new_registration' },
          newUser
        );

        navigate('/worlds');
      } else {
        audioManager.playError();
        setStatusMessage({ type: 'error', text: regRes.message || 'Unable to create account. Please try again.' });
      }
    }
  };

  const handleGuestPlay = () => {
    audioManager.playClick();
    loginGuest();
    navigate('/worlds');
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', padding: '2rem',
      background: 'url("/login-bg.jpg") center/cover no-repeat fixed',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(10, 14, 23, 0.8)'
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img 
            src="/assets/codesaga-logo-web.png" 
            alt="CodeSaga" 
            style={{ maxHeight: '70px', maxWidth: '100%', objectFit: 'contain', marginBottom: '0.5rem' }} 
          />
          <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: 'var(--accent-teal)', textShadow: '1px 1px 0 #000' }}>
            Interactive Programming & RPG Detective Quests
          </p>
        </div>

        <PixelPanel style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {statusMessage && (
            <div style={{ 
              color: statusMessage.type === 'error' ? '#fee2e2' : statusMessage.type === 'success' ? '#ccfbf1' : '#e0f2fe', 
              backgroundColor: statusMessage.type === 'error' ? '#991b1b' : statusMessage.type === 'success' ? '#115e59' : '#0369a1', 
              fontSize: '0.8rem', 
              textAlign: 'center', 
              padding: '0.75rem', 
              borderRadius: '6px', 
              border: `2px solid ${statusMessage.type === 'error' ? '#ef4444' : statusMessage.type === 'success' ? '#14b8a6' : '#38bdf8'}`
            }}>
              {statusMessage.text}
            </div>
          )}

          {step === 'login' ? (
            /* PASSWORD LOGIN FORM */
            <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-pixel)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  🔑 CODESAGA LOGIN
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Enter your registered email and password to continue your quest.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="detective@codesaga.io"
                  disabled={loading}
                  data-cursor="text"
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '6px',
                    border: '2px solid var(--panel-border)', background: 'rgba(0,0,0,0.5)',
                    color: 'white', fontFamily: 'var(--font-body)', outline: 'none',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      audioManager.playClick();
                      setIsForgotPassword(true);
                      setAuthMethod('otp');
                      setStep('email');
                      setStatusMessage({ type: 'info', text: 'Enter your email to verify with OTP and reset password.' });
                    }}
                    data-cursor="interaction"
                    style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Forgot password?
                  </button>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  data-cursor="text"
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '6px',
                    border: '2px solid var(--panel-border)', background: 'rgba(0,0,0,0.5)',
                    color: 'white', fontFamily: 'var(--font-body)', outline: 'none',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <GameButton type="submit" disabled={loading || !email.trim() || !password.trim()} variant="gold" style={{ marginTop: '0.5rem' }}>
                {loading ? 'Authenticating... ⏳' : 'LOGIN 🚀'}
              </GameButton>

              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    audioManager.playClick();
                    setIsForgotPassword(false);
                    setAuthMethod('otp');
                    setStep('email');
                    setStatusMessage(null);
                  }}
                  data-cursor="interaction"
                  style={{ background: 'none', border: 'none', color: 'var(--accent-teal)', fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  📩 Sign in with Email OTP instead
                </button>
              </div>
            </form>
          ) : step === 'email' ? (
            /* STEP 1: EMAIL ADDRESS INPUT FOR OTP */
            <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-pixel)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  {isForgotPassword ? '🔒 FORGOT PASSWORD VERIFICATION' : '📩 EMAIL OTP VERIFICATION'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {isForgotPassword 
                    ? 'Enter your registered email to receive a password reset verification code.' 
                    : 'Enter your email address to receive a 6-digit verification code.'}
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="detective@codesaga.io"
                  disabled={loading}
                  data-cursor="text"
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '6px',
                    border: '2px solid var(--panel-border)', background: 'rgba(0,0,0,0.5)',
                    color: 'white', fontFamily: 'var(--font-body)', outline: 'none',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <GameButton type="submit" disabled={loading || !email.trim()} variant="gold" style={{ marginTop: '0.5rem' }}>
                {loading ? 'Sending OTP... ⏳' : 'SEND OTP 📩'}
              </GameButton>

              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    audioManager.playBack();
                    setIsForgotPassword(false);
                    setAuthMethod('password');
                    setStep('login');
                    setStatusMessage(null);
                  }}
                  data-cursor="interaction"
                  style={{ background: 'none', border: 'none', color: 'var(--accent-teal)', fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  🔑 Back to Password Login
                </button>
              </div>
            </form>
          ) : step === 'otp' ? (
            /* STEP 2: 6-DIGIT OTP VERIFICATION INPUT */
            <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-pixel)', fontSize: '1rem', marginBottom: '0.4rem' }}>
                  🔑 ENTER VERIFICATION OTP
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#A8B8B4', margin: 0 }}>
                  OTP sent to <strong style={{ color: '#38bdf8' }}>{normalizeEmail(email)}</strong>
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>6-Digit Verification Code</label>
                <input 
                  type="text" 
                  value={otpCode}
                  maxLength={6}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  disabled={loading}
                  autoFocus
                  data-cursor="text"
                  style={{
                    width: '100%', padding: '0.85rem', borderRadius: '6px',
                    border: '2px solid #E6A93D', background: 'rgba(0,0,0,0.6)',
                    color: '#E6A93D', fontFamily: 'var(--font-pixel)', outline: 'none',
                    fontSize: '1.4rem', letterSpacing: '8px', textAlign: 'center'
                  }}
                />
              </div>

              <GameButton type="submit" disabled={loading || otpCode.length !== 6} variant="gold">
                {loading ? 'Verifying OTP... ⏳' : 'VERIFY OTP 🚀'}
              </GameButton>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={cooldown > 0 || loading}
                  data-cursor="interaction"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: cooldown > 0 ? '#64748b' : '#38bdf8',
                    fontSize: '0.75rem',
                    textDecoration: cooldown > 0 ? 'none' : 'underline',
                    cursor: cooldown > 0 ? 'default' : 'pointer'
                  }}
                >
                  {cooldown > 0 ? `Resend OTP in ${cooldown}s` : '🔄 Resend OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    audioManager.playBack();
                    setStep('email');
                    setStatusMessage(null);
                    setOtpCode('');
                  }}
                  data-cursor="interaction"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  ✏️ Change Email
                </button>
              </div>
            </form>
          ) : step === 'username' ? (
            /* STEP 3: NEW USER USERNAME CREATION */
            <form onSubmit={handleCreateUsername} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-pixel)', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                  🕵️ CHOOSE YOUR USERNAME
                </h3>
                <div style={{ 
                  backgroundColor: 'rgba(234, 179, 8, 0.15)', 
                  border: '1px solid #eab308', 
                  borderRadius: '6px', 
                  padding: '0.6rem',
                  fontSize: '0.75rem',
                  color: '#fef08a',
                  marginBottom: '0.5rem'
                }}>
                  ⚠️ This username will be displayed on your certificate.
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Detective Handle / Display Name</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="DetectiveAria"
                  disabled={loading}
                  autoFocus
                  data-cursor="text"
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '6px',
                    border: '2px solid var(--accent-gold)', background: 'rgba(0,0,0,0.5)',
                    color: 'white', fontFamily: 'var(--font-body)', outline: 'none',
                    fontSize: '1.1rem'
                  }}
                />
              </div>

              <GameButton type="submit" disabled={loading || !username.trim()} variant="gold">
                NEXT: CREATE PASSWORD 🔑
              </GameButton>
            </form>
          ) : (
            /* STEP 4: CREATE / RESET PASSWORD */
            <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-pixel)', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                  🔒 CREATE YOUR CODESAGA PASSWORD
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Password must be at least 8 characters long and contain both letters and numbers.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  autoFocus
                  data-cursor="text"
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '6px',
                    border: '2px solid var(--accent-gold)', background: 'rgba(0,0,0,0.5)',
                    color: 'white', fontFamily: 'var(--font-body)', outline: 'none',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  data-cursor="text"
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '6px',
                    border: '2px solid var(--accent-gold)', background: 'rgba(0,0,0,0.5)',
                    color: 'white', fontFamily: 'var(--font-body)', outline: 'none',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <GameButton type="submit" disabled={loading || !password || !confirmPassword} variant="gold">
                {loading ? 'Configuring Password... ⏳' : 'CREATE PASSWORD & ENTER 🚀'}
              </GameButton>
            </form>
          )}

          <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
            <div style={{ flex: 1, height: '2px', backgroundColor: 'var(--panel-border)' }} />
            <span style={{ padding: '0 0.75rem', fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-pixel)' }}>OR</span>
            <div style={{ flex: 1, height: '2px', backgroundColor: 'var(--panel-border)' }} />
          </div>

          <GameButton onClick={handleGuestPlay} variant="secondary">
            CONTINUE AS GUEST 🎭
          </GameButton>
        </PixelPanel>
      </div>
    </div>
  );
};

export default Login;
