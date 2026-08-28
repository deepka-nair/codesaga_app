import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getUserFromApi,
  loginWithPasswordApi,
  registerUserInApi,
  setPasswordApi,
  getUserProgressFromApi
} from '../services/mobileApi';
import PixelCharacterAvatar from '../components/PixelCharacterAvatar';
import { CHARACTERS } from '../../data/characterSprites';

export default function LoginScreen({ onLoginSuccess, onGuestLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedChar, setSelectedChar] = useState('m1');
  
  // Modes: 'check_email', 'password_login', 'set_password', 'register'
  const [mode, setMode] = useState('check_email');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusInfo, setStatusInfo] = useState('');

  const normalizeEmail = (str) => String(str || '').trim().toLowerCase();

  const handleEmailSubmit = async () => {
    setErrorMessage('');
    setStatusInfo('');
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('PLEASE ENTER A VALID DETECTIVE EMAIL');
      return;
    }

    setLoading(true);
    try {
      const res = await getUserFromApi(cleanEmail);
      setLoading(false);

      if (!res.success && res.offline) {
        setErrorMessage(res.message || 'SERVER CONNECTION FAILURE');
        return;
      }

      if (res.exists) {
        if (res.hasPassword) {
          setMode('password_login');
          setStatusInfo(`WELCOME BACK! ENTER PASSWORD FOR ${cleanEmail.toUpperCase()}`);
        } else {
          setMode('set_password');
          setStatusInfo(`ACCOUNT FOUND. CONFIGURE DETECTIVE PASSWORD FOR ${cleanEmail.toUpperCase()}`);
        }
      } else {
        setMode('register');
        setStatusInfo(`NEW SLEUTH PROFILE DETECTED FOR ${cleanEmail.toUpperCase()}`);
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage('NETWORK REQUEST FAILED');
    }
  };

  const handlePasswordLogin = async () => {
    setErrorMessage('');
    const cleanEmail = normalizeEmail(email);

    if (!password) {
      setErrorMessage('PLEASE ENTER YOUR PASSWORD');
      return;
    }

    setLoading(true);
    try {
      const loginRes = await loginWithPasswordApi(cleanEmail, password);
      if (!loginRes.success) {
        setLoading(false);
        setErrorMessage(loginRes.message || 'INCORRECT EMAIL OR PASSWORD');
        return;
      }

      // Fetch cloud progress snapshot
      const progressRes = await getUserProgressFromApi(cleanEmail);
      setLoading(false);

      onLoginSuccess(loginRes.user, progressRes?.progress || null);
    } catch (err) {
      setLoading(false);
      setErrorMessage('LOGIN AUTHENTICATION FAILED');
    }
  };

  const handleSetPassword = async () => {
    setErrorMessage('');
    const cleanEmail = normalizeEmail(email);

    if (!password || password.length < 8) {
      setErrorMessage('PASSWORD MUST BE AT LEAST 8 CHARACTERS');
      return;
    }

    setLoading(true);
    try {
      const setRes = await setPasswordApi(cleanEmail, password);
      if (!setRes.success) {
        setLoading(false);
        setErrorMessage(setRes.message || 'FAILED TO SAVE PASSWORD');
        return;
      }

      const progressRes = await getUserProgressFromApi(cleanEmail);
      setLoading(false);

      onLoginSuccess(setRes.user, progressRes?.progress || null);
    } catch (err) {
      setLoading(false);
      setErrorMessage('PASSWORD CONFIGURATION FAILED');
    }
  };

  const handleRegister = async () => {
    setErrorMessage('');
    const cleanEmail = normalizeEmail(email);
    const cleanUsername = String(username).trim() || cleanEmail.split('@')[0];

    if (!password || password.length < 8) {
      setErrorMessage('PASSWORD MUST BE AT LEAST 8 CHARACTERS WITH LETTERS & NUMBERS');
      return;
    }

    setLoading(true);
    try {
      const regRes = await registerUserInApi(cleanEmail, cleanUsername, password);
      if (!regRes.success) {
        setLoading(false);
        setErrorMessage(regRes.message || 'REGISTRATION FAILED');
        return;
      }

      setLoading(false);
      onLoginSuccess(regRes.user, { character: selectedChar });
    } catch (err) {
      setLoading(false);
      setErrorMessage('REGISTRATION REQUEST FAILED');
    }
  };

  const handleReset = () => {
    setMode('check_email');
    setPassword('');
    setErrorMessage('');
    setStatusInfo('');
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/login-bg.jpg')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {/* Header / Logo */}
            <View style={styles.header}>
              <Image
                source={require('../../../assets/splash.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.tagline}>CODE DETECTIVE SAGA</Text>
              <Text style={styles.subtext}>EXPO MOBILE • SHARED BACKEND & MONGODB ATLAS</Text>
            </View>

            {/* Pixel Panel Card */}
            <View style={styles.pixelPanel}>
              <Text style={styles.panelTitle}>
                {mode === 'check_email' && 'AUTHENTICATE'}
                {mode === 'password_login' && 'ENTER PASSWORD'}
                {mode === 'set_password' && 'CREATE PASSWORD'}
                {mode === 'register' && 'NEW SLEUTH PROFILE'}
              </Text>

              {Boolean(statusInfo) && (
                <View style={styles.infoBanner}>
                  <Text style={styles.infoText}>{statusInfo}</Text>
                </View>
              )}

              {Boolean(errorMessage) && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}

              {/* Email Input */}
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={[styles.input, mode !== 'check_email' && styles.disabledInput]}
                placeholder="detective@codesaga.com"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={mode === 'check_email'}
              />

              {/* Character Avatar Selector (For Registration Mode) */}
              {mode === 'register' && (
                <>
                  <Text style={styles.label}>SELECT DETECTIVE AVATAR</Text>
                  <View style={styles.charGrid}>
                    {CHARACTERS.slice(0, 6).map((c) => {
                      const isSel = selectedChar === c.id;
                      return (
                        <TouchableOpacity
                          key={c.id}
                          style={[styles.charBox, isSel && styles.charBoxSelected]}
                          onPress={() => setSelectedChar(c.id)}
                        >
                          <PixelCharacterAvatar characterId={c.id} size={32} borderColor={c.color} />
                          <Text style={[styles.charName, isSel && { color: '#f59e0b' }]}>{c.name}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <Text style={styles.label}>SLEUTH USERNAME</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Agent Silver"
                    placeholderTextColor="#64748b"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </>
              )}

              {/* Password Input */}
              {mode !== 'check_email' && (
                <>
                  <Text style={styles.label}>
                    {mode === 'password_login' ? 'PASSWORD' : 'NEW PASSWORD (MIN 8 CHARS)'}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#64748b"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </>
              )}

              {/* Pixel Primary Button */}
              <TouchableOpacity
                style={styles.pixelButton}
                onPress={() => {
                  if (mode === 'check_email') handleEmailSubmit();
                  else if (mode === 'password_login') handlePasswordLogin();
                  else if (mode === 'set_password') handleSetPassword();
                  else if (mode === 'register') handleRegister();
                }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#0a0e17" />
                ) : (
                  <Text style={styles.pixelButtonText}>
                    {mode === 'check_email' && 'CONTINUE →'}
                    {mode === 'password_login' && 'ENTER SAGA'}
                    {mode === 'set_password' && 'SAVE & CONTINUE'}
                    {mode === 'register' && 'START INVESTIGATION'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Reset Link */}
              {mode !== 'check_email' && (
                <TouchableOpacity style={styles.linkButton} onPress={handleReset}>
                  <Text style={styles.linkButtonText}>← USE DIFFERENT EMAIL</Text>
                </TouchableOpacity>
              )}

              {/* Guest Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.pixelSecondaryButton} onPress={onGuestLogin}>
                <Text style={styles.pixelSecondaryButtonText}>🎮 GUEST INVESTIGATION</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 23, 0.78)'
  },
  container: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10
  },
  logo: {
    width: 220,
    height: 65
  },
  tagline: {
    fontFamily: 'PressStart2P',
    color: '#f59e0b',
    fontSize: 10,
    marginTop: 8,
    textAlign: 'center'
  },
  subtext: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center'
  },
  pixelPanel: {
    width: '100%',
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 4,
    borderColor: '#1e293b'
  },
  panelTitle: {
    fontFamily: 'PressStart2P',
    color: '#f8fafc',
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center'
  },
  infoBanner: {
    backgroundColor: '#1e1b4b',
    borderColor: '#4338ca',
    borderWidth: 2,
    borderRadius: 6,
    padding: 8,
    marginBottom: 12
  },
  infoText: {
    fontFamily: 'Outfit',
    color: '#a5b4fc',
    fontSize: 12,
    textAlign: 'center'
  },
  errorBanner: {
    backgroundColor: '#451a03',
    borderColor: '#9a3412',
    borderWidth: 2,
    borderRadius: 6,
    padding: 8,
    marginBottom: 12
  },
  errorText: {
    fontFamily: 'Outfit',
    color: '#fca5a5',
    fontSize: 12,
    textAlign: 'center'
  },
  label: {
    fontFamily: 'PressStart2P',
    color: '#94a3b8',
    fontSize: 9,
    marginBottom: 6,
    marginTop: 4
  },
  input: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderWidth: 2,
    borderRadius: 8,
    color: '#f8fafc',
    fontFamily: 'Outfit',
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12
  },
  disabledInput: {
    opacity: 0.6
  },
  charGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  charBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f172a',
    borderWidth: 2,
    borderColor: '#334155',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6
  },
  charBoxSelected: {
    borderColor: '#f59e0b',
    backgroundColor: '#1e293b'
  },
  charName: {
    fontFamily: 'PressStart2P',
    color: '#94a3b8',
    fontSize: 8
  },
  pixelButton: {
    backgroundColor: '#14b8a6',
    borderWidth: 4,
    borderColor: '#0f766e',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6
  },
  pixelButtonText: {
    fontFamily: 'PressStart2P',
    color: '#0a0e17',
    fontSize: 10
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 12
  },
  linkButtonText: {
    fontFamily: 'PressStart2P',
    color: '#818cf8',
    fontSize: 8
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#334155'
  },
  dividerText: {
    fontFamily: 'PressStart2P',
    color: '#64748b',
    paddingHorizontal: 8,
    fontSize: 8
  },
  pixelSecondaryButton: {
    backgroundColor: '#1e293b',
    borderColor: '#475569',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center'
  },
  pixelSecondaryButtonText: {
    fontFamily: 'PressStart2P',
    color: '#e2e8f0',
    fontSize: 9
  }
});
