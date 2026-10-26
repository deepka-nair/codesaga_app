import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screens/LoginScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import DashboardScreen from './screens/DashboardScreen';
import WorldDetailScreen from './screens/WorldDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import ScannerScreen from './screens/ScannerScreen';
import CertificateModal from './screens/CertificateModal';
import BottomNavBar from './components/BottomNavBar';

import { saveUserProgressToApi, recordLoginInApi, getUserProgressFromApi } from './services/mobileApi';
import mobileAudio from './services/mobileAudio';

const STORAGE_KEY_SESSION = '@codesaga_mobile_session';

const DEFAULT_USER_STATE = {
  user: null,
  isGuest: false,
  xp: 150,
  level: 1,
  coins: 70,
  hearts: 5,
  streak: 1,
  character: 'm1',
  completedMissions: [],
  completedChapters: [],
  unlockedChapters: [1],
  earnedAchievements: [],
  certificates: {},
  worldCertificates: {},
  worldProgress: {
    sqlProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
    pythonProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
    javaProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
    frontendProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
    cppProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
    backendProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] }
  },
  githubConnected: false,
  githubProfile: null
};

export default function AppMobile() {
  const [fontsLoaded] = useFonts({
    'PressStart2P': require('../../assets/fonts/PressStart2P-Regular.ttf'),
    'Outfit': require('../../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../../assets/fonts/Outfit-Bold.ttf'),
  });

  const [screen, setScreen] = useState('login'); // 'login' | 'onboarding' | 'dashboard' | 'world_detail' | 'scanner' | 'profile'
  const [selectedWorldId, setSelectedWorldId] = useState('sql');
  const [profileTab, setProfileTab] = useState('overview');
  const [userState, setUserState] = useState(DEFAULT_USER_STATE);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionRestored, setSessionRestored] = useState(false);

  // Certificate Modal State
  const [certModalVisible, setCertModalVisible] = useState(false);
  const [activeCertData, setActiveCertData] = useState({});
  const [activeCertWorldName, setActiveCertWorldName] = useState('DATABASE DETECTIVE CITY');

  // Restore saved session from AsyncStorage on startup
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY_SESSION);
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.user) {
            setUserState(parsed);
            setScreen('dashboard');

            // Sync with backend in background if user is registered
            if (parsed.user.email && !parsed.isGuest) {
              getUserProgressFromApi(parsed.user.email)
                .then((cloudRes) => {
                  if (cloudRes?.progress && isMounted) {
                    setUserState((prev) => ({
                      ...prev,
                      xp: cloudRes.progress.xp ?? prev.xp,
                      level: cloudRes.progress.level ?? prev.level,
                      coins: cloudRes.progress.coins ?? prev.coins,
                      completedMissions: cloudRes.progress.completedMissions ?? prev.completedMissions,
                      completedChapters: cloudRes.progress.completedChapters ?? prev.completedChapters,
                      unlockedChapters: cloudRes.progress.unlockedChapters ?? prev.unlockedChapters,
                      worldProgress: cloudRes.progress.worldProgress || prev.worldProgress,
                      certificates: cloudRes.progress.certificates || prev.certificates,
                      worldCertificates: cloudRes.progress.certificates?.worldCertificates || cloudRes.progress.worldCertificates || prev.worldCertificates,
                      githubConnected: cloudRes.progress.githubConnected ?? prev.githubConnected,
                      githubProfile: cloudRes.progress.githubProfile ?? prev.githubProfile
                    }));
                  }
                })
                .catch((e) => console.log('[Session] Background sync skipped:', e.message));
            }
          }
        }
      } catch (err) {
        console.warn('[Session] Restore error:', err);
      } finally {
        if (isMounted) setSessionRestored(true);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const handleToggleSound = () => {
    const nextMuted = mobileAudio.toggleMute();
    setSoundEnabled(!nextMuted);
  };

  // Persist session to local storage & auto-sync progress to cloud on change
  useEffect(() => {
    if (!sessionRestored) return;

    if (userState.user) {
      AsyncStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(userState)).catch((e) =>
        console.warn('[Session] Local save error:', e)
      );
    }

    if (userState.user?.email && !userState.isGuest) {
      saveUserProgressToApi(userState.user.email, {
        xp: userState.xp,
        level: userState.level,
        coins: userState.coins,
        hearts: userState.hearts,
        streak: userState.streak,
        character: userState.character,
        completedMissions: userState.completedMissions,
        completedChapters: userState.completedChapters,
        unlockedChapters: userState.unlockedChapters,
        earnedAchievements: userState.earnedAchievements,
        worldProgress: userState.worldProgress,
        certificates: userState.certificates,
        worldCertificates: userState.worldCertificates,
        githubConnected: userState.githubConnected,
        githubProfile: userState.githubProfile
      }).catch((err) => console.warn('[Mobile Sync] Progress save error:', err));
    }
  }, [
    sessionRestored,
    userState.xp,
    userState.level,
    userState.coins,
    userState.character,
    userState.completedMissions,
    userState.completedChapters,
    userState.unlockedChapters,
    userState.earnedAchievements,
    userState.certificates,
    userState.worldCertificates,
    userState.githubConnected,
    userState.githubProfile
  ]);

  if (!fontsLoaded || !sessionRestored) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#14b8a6" />
        <Text style={styles.loadingText}>LOADING CODESAGA MOBILE...</Text>
      </View>
    );
  }

  // Auth Callbacks
  const handleLoginSuccess = (user, cloudProgress) => {
    recordLoginInApi(user.email);
    const newState = {
      ...DEFAULT_USER_STATE,
      user,
      isGuest: false,
      xp: cloudProgress?.xp ?? 150,
      level: cloudProgress?.level ?? 1,
      coins: cloudProgress?.coins ?? 70,
      hearts: cloudProgress?.hearts ?? 5,
      streak: cloudProgress?.streak ?? 1,
      character: cloudProgress?.character ?? 'm1',
      completedMissions: cloudProgress?.completedMissions ?? [],
      completedChapters: cloudProgress?.completedChapters ?? [],
      unlockedChapters: cloudProgress?.unlockedChapters ?? [1],
      earnedAchievements: cloudProgress?.earnedAchievements ?? [],
      worldProgress: cloudProgress?.worldProgress || DEFAULT_USER_STATE.worldProgress,
      certificates: cloudProgress?.certificates || user?.certificates || {},
      worldCertificates: cloudProgress?.certificates?.worldCertificates || user?.certificates?.worldCertificates || cloudProgress?.worldCertificates || {},
      githubConnected: cloudProgress?.githubConnected ?? false,
      githubProfile: cloudProgress?.githubProfile ?? null
    };
    setUserState(newState);
    AsyncStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(newState)).catch((e) =>
      console.warn('[Session] Login save error:', e)
    );

    if (!cloudProgress?.character && !cloudProgress?.completedMissions?.length) {
      setScreen('onboarding');
    } else {
      setScreen('dashboard');
    }
  };

  const handleGuestLogin = () => {
    const guestState = {
      ...DEFAULT_USER_STATE,
      user: { name: 'Guest Sleuth', email: 'guest@codesaga.local', role: 'guest' },
      isGuest: true
    };
    setUserState(guestState);
    AsyncStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(guestState)).catch((e) =>
      console.warn('[Session] Guest save error:', e)
    );
    setScreen('dashboard');
  };

  const handleLogout = async () => {
    mobileAudio.playClick();
    await AsyncStorage.removeItem(STORAGE_KEY_SESSION).catch((e) =>
      console.warn('[Session] Remove error:', e)
    );
    setUserState(DEFAULT_USER_STATE);
    setScreen('login');
  };

  const handleOnboardingComplete = (data) => {
    setUserState((prev) => ({
      ...prev,
      character: data.character || 'm1',
      xp: prev.xp + 100,
      coins: prev.coins + 50
    }));
    setScreen('dashboard');
  };

  const handleUpdateState = (newState) => {
    setUserState((prev) => ({ ...prev, ...newState }));
  };

  const handleMissionComplete = (missionId, rewardXp = 50, rewardCoins = 20) => {
    setUserState((prev) => {
      if (prev.completedMissions.includes(missionId)) return prev;

      const newMissions = [...prev.completedMissions, missionId];
      const newXp = prev.xp + rewardXp;
      const newCoins = prev.coins + rewardCoins;
      const newLevel = Math.floor(newXp / 500) + 1;

      const newAch = [...prev.earnedAchievements];
      if (newMissions.length >= 1 && !newAch.includes('First Sleuth Step')) {
        newAch.push('First Sleuth Step');
      }
      if (newMissions.length >= 5 && !newAch.includes('Database Master')) {
        newAch.push('Database Master');
      }
      if (newMissions.length >= 10 && !newAch.includes('Saga Champion')) {
        newAch.push('Saga Champion');
      }

      // Update world-specific progress
      const currentWProgress = prev.worldProgress || DEFAULT_USER_STATE.worldProgress;
      const targetWorldKey = `${selectedWorldId}Progress`;
      const worldObj = currentWProgress[targetWorldKey] || { completedMissions: [], completedChapters: [] };

      const updatedWorldObj = {
        ...worldObj,
        completedMissions: [...(worldObj.completedMissions || []), missionId]
      };

      return {
        ...prev,
        completedMissions: newMissions,
        xp: newXp,
        coins: newCoins,
        level: newLevel,
        earnedAchievements: newAch,
        worldProgress: {
          ...currentWProgress,
          [targetWorldKey]: updatedWorldObj
        }
      };
    });
  };

  const handleChapterComplete = (worldId, completedChId, nextChId) => {
    setUserState((prev) => {
      const targetWorldKey = `${worldId}Progress`;
      const currentWProgress = prev.worldProgress || DEFAULT_USER_STATE.worldProgress;
      const worldObj = currentWProgress[targetWorldKey] || { completedMissions: [], completedChapters: [], unlockedChapters: [1] };

      const currentCompleted = worldObj.completedChapters || [];
      const updatedCompleted = currentCompleted.includes(completedChId)
        ? currentCompleted
        : [...currentCompleted, completedChId];

      const currentUnlocked = worldObj.unlockedChapters || [1];
      const updatedUnlocked = currentUnlocked.includes(nextChId)
        ? currentUnlocked
        : [...currentUnlocked, nextChId];

      const updatedWorldObj = {
        ...worldObj,
        currentChapter: nextChId,
        completedChapters: updatedCompleted,
        unlockedChapters: updatedUnlocked
      };

      const globalCompleted = prev.completedChapters.includes(completedChId)
        ? prev.completedChapters
        : [...prev.completedChapters, completedChId];

      const globalUnlocked = prev.unlockedChapters.includes(nextChId)
        ? prev.unlockedChapters
        : [...prev.unlockedChapters, nextChId];

      const nextState = {
        ...prev,
        completedChapters: globalCompleted,
        unlockedChapters: globalUnlocked,
        worldProgress: {
          ...currentWProgress,
          [targetWorldKey]: updatedWorldObj
        }
      };

      AsyncStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(nextState)).catch((e) =>
        console.warn('[Session] Chapter complete save error:', e)
      );

      if (prev.user?.email && !prev.isGuest) {
        saveUserProgressToApi(prev.user.email, {
          xp: nextState.xp,
          level: nextState.level,
          coins: nextState.coins,
          hearts: nextState.hearts,
          streak: nextState.streak,
          character: nextState.character,
          completedMissions: nextState.completedMissions,
          completedChapters: nextState.completedChapters,
          unlockedChapters: nextState.unlockedChapters,
          earnedAchievements: nextState.earnedAchievements,
          worldProgress: nextState.worldProgress,
          certificates: nextState.certificates,
          worldCertificates: nextState.worldCertificates,
          githubConnected: nextState.githubConnected,
          githubProfile: nextState.githubProfile
        }).catch((err) => console.warn('[Mobile Sync] Chapter save error:', err));
      }

      return nextState;
    });
  };

  const handleOpenCertificateModal = (certData, wName) => {
    let finalCert = certData;
    if (!finalCert || (!finalCert.id && !finalCert.certificateId && !finalCert.error && !finalCert.notFound)) {
      if (userState.certificates?.certificateIssued || userState.certificates?.certificateId) {
        finalCert = {
          id: userState.certificates.certificateId,
          certificateId: userState.certificates.certificateId,
          issued_at: userState.certificates.certificateIssuedAt,
          certificateIssuedAt: userState.certificates.certificateIssuedAt,
          certificateName: userState.certificates.certificateName || userState.user?.username || userState.user?.name || 'Detective'
        };
      } else {
        finalCert = {
          notFound: true,
          error: true,
          message: 'No official certificates have been earned or issued to this account yet.'
        };
      }
    }
    setActiveCertData(finalCert);
    setActiveCertWorldName(wName || 'CODESAGA OFFICIAL CERTIFICATION');
    setCertModalVisible(true);
  };

  const handleBottomTabPress = (tabId) => {
    mobileAudio.playClick();
    if (tabId === 'dashboard' || tabId === 'worlds') {
      setScreen('dashboard');
    } else if (tabId === 'quest') {
      setScreen('world_detail');
    } else if (tabId === 'scanner') {
      setScreen('scanner');
    } else if (tabId === 'profile') {
      setProfileTab('overview');
      setScreen('profile');
    } else if (tabId === 'certificates') {
      setProfileTab('certificates');
      setScreen('profile');
    }
  };

  const getActiveBottomTab = () => {
    if (screen === 'dashboard') return 'worlds';
    if (screen === 'world_detail') return 'quest';
    if (screen === 'scanner') return 'scanner';
    if (screen === 'profile') {
      if (profileTab === 'certificates') return 'certificates';
      return 'profile';
    }
    return 'worlds';
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0e17" translucent />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          {screen === 'login' && (
            <LoginScreen
              onLoginSuccess={handleLoginSuccess}
              onGuestLogin={handleGuestLogin}
            />
          )}

          {screen === 'onboarding' && (
            <OnboardingScreen
              onComplete={handleOnboardingComplete}
            />
          )}

          {screen === 'dashboard' && (
            <DashboardScreen
              userState={userState}
              onSelectWorld={(wId) => {
                setSelectedWorldId(wId);
                setScreen('world_detail');
              }}
              onOpenProfile={() => {
                setProfileTab('overview');
                setScreen('profile');
              }}
              onLogout={handleLogout}
              onToggleSound={handleToggleSound}
              soundEnabled={soundEnabled}
            />
          )}

          {screen === 'world_detail' && (
            <WorldDetailScreen
              worldId={selectedWorldId}
              userState={userState}
              onBack={() => setScreen('dashboard')}
              onMissionComplete={handleMissionComplete}
              onChapterComplete={handleChapterComplete}
              onOpenProfile={() => {
                setProfileTab('overview');
                setScreen('profile');
              }}
              onViewCertificate={() => handleOpenCertificateModal(userState.worldCertificates?.[selectedWorldId], selectedWorldId.toUpperCase())}
              onToggleSound={handleToggleSound}
              soundEnabled={soundEnabled}
            />
          )}

          {screen === 'scanner' && (
            <ScannerScreen
              onBack={() => setScreen('dashboard')}
              onScanComplete={(code) => {
                // If scanned a certificate
                if (code.startsWith('CS-')) {
                  handleOpenCertificateModal({ id: code }, 'VERIFIED DETECTIVE CASE');
                }
              }}
            />
          )}

          {screen === 'profile' && (
            <ProfileScreen
              userState={userState}
              initialTab={profileTab}
              onBack={() => setScreen('dashboard')}
              onLogout={handleLogout}
              onUpdateState={handleUpdateState}
              onViewCertificate={(cert, name) => handleOpenCertificateModal(cert, name)}
            />
          )}
        </View>

        {/* Global Bottom Navigation Bar */}
        {screen !== 'login' && screen !== 'onboarding' && (
          <BottomNavBar
            activeTab={getActiveBottomTab()}
            onTabPress={handleBottomTabPress}
          />
        )}

        {/* Certificate Modal Diploma */}
        <CertificateModal
          visible={certModalVisible}
          onClose={() => setCertModalVisible(false)}
          certificateData={activeCertData}
          worldName={activeCertWorldName}
          studentName={userState.user?.name || userState.user?.username || 'Detective'}
          githubProfile={userState.githubProfile}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e17'
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0e17'
  },
  content: {
    flex: 1,
    backgroundColor: '#0a0e17'
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0e17',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  loadingText: {
    fontFamily: 'PressStart2P',
    color: '#14b8a6',
    fontSize: 10
  }
});
