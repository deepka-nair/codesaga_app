import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import WorldDetailScreen from './screens/WorldDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNavBar from './components/BottomNavBar';

import { saveUserProgressToApi } from './services/mobileApi';

const DEFAULT_USER_STATE = {
  user: null,
  isGuest: false,
  xp: 0,
  level: 1,
  coins: 70,
  hearts: 5,
  streak: 1,
  character: 'm1',
  completedMissions: [],
  earnedAchievements: [],
  certificates: {},
  githubConnected: false,
  githubProfile: null
};

export default function AppMobile() {
  const [fontsLoaded] = useFonts({
    'PressStart2P': require('../../assets/fonts/PressStart2P-Regular.ttf'),
    'Outfit': require('../../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../../assets/fonts/Outfit-Bold.ttf'),
  });

  const [screen, setScreen] = useState('login'); // 'login' | 'dashboard' | 'world_detail' | 'profile'
  const [selectedWorldId, setSelectedWorldId] = useState('sql');
  const [profileTab, setProfileTab] = useState('overview');
  const [userState, setUserState] = useState(DEFAULT_USER_STATE);

  // Auto-sync progress to cloud on change
  useEffect(() => {
    if (userState.user?.email && !userState.isGuest) {
      saveUserProgressToApi(userState.user.email, {
        xp: userState.xp,
        level: userState.level,
        coins: userState.coins,
        hearts: userState.hearts,
        streak: userState.streak,
        character: userState.character,
        completedMissions: userState.completedMissions,
        earnedAchievements: userState.earnedAchievements,
        certificates: userState.certificates,
        githubConnected: userState.githubConnected,
        githubProfile: userState.githubProfile
      }).catch((err) => console.warn('[Mobile Sync] Progress save error:', err));
    }
  }, [
    userState.xp,
    userState.level,
    userState.coins,
    userState.character,
    userState.completedMissions,
    userState.earnedAchievements,
    userState.certificates,
    userState.githubConnected
  ]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#14b8a6" />
        <Text style={styles.loadingText}>LOADING CODESAGA MOBILE...</Text>
      </View>
    );
  }

  // Auth Callbacks
  const handleLoginSuccess = (user, cloudProgress) => {
    setUserState({
      ...DEFAULT_USER_STATE,
      user,
      isGuest: false,
      xp: cloudProgress?.xp ?? 0,
      level: cloudProgress?.level ?? 1,
      coins: cloudProgress?.coins ?? 70,
      hearts: cloudProgress?.hearts ?? 5,
      streak: cloudProgress?.streak ?? 1,
      character: cloudProgress?.character ?? 'm1',
      completedMissions: cloudProgress?.completedMissions ?? [],
      earnedAchievements: cloudProgress?.earnedAchievements ?? [],
      certificates: cloudProgress?.certificates ?? {},
      githubConnected: cloudProgress?.githubConnected ?? false,
      githubProfile: cloudProgress?.githubProfile ?? null
    });
    setScreen('dashboard');
  };

  const handleGuestLogin = () => {
    setUserState({
      ...DEFAULT_USER_STATE,
      user: { name: 'Guest Sleuth', email: 'guest@codesaga.local' },
      isGuest: true
    });
    setScreen('dashboard');
  };

  const handleLogout = () => {
    setUserState(DEFAULT_USER_STATE);
    setScreen('login');
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

      return {
        ...prev,
        completedMissions: newMissions,
        xp: newXp,
        coins: newCoins,
        level: newLevel,
        earnedAchievements: newAch
      };
    });
  };

  const handleBottomTabPress = (tabId) => {
    if (tabId === 'dashboard' || tabId === 'worlds') {
      setScreen('dashboard');
    } else if (tabId === 'profile') {
      setProfileTab('overview');
      setScreen('profile');
    } else if (tabId === 'certificates') {
      setProfileTab('certificates');
      setScreen('profile');
    } else if (tabId === 'github') {
      setProfileTab('github');
      setScreen('profile');
    }
  };

  const getActiveBottomTab = () => {
    if (screen === 'dashboard') return 'dashboard';
    if (screen === 'world_detail') return 'worlds';
    if (screen === 'profile') {
      if (profileTab === 'certificates') return 'certificates';
      if (profileTab === 'github') return 'github';
      return 'profile';
    }
    return 'dashboard';
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
            />
          )}

          {screen === 'world_detail' && (
            <WorldDetailScreen
              worldId={selectedWorldId}
              userState={userState}
              onBack={() => setScreen('dashboard')}
              onMissionComplete={handleMissionComplete}
            />
          )}

          {screen === 'profile' && (
            <ProfileScreen
              userState={userState}
              initialTab={profileTab}
              onBack={() => setScreen('dashboard')}
              onLogout={handleLogout}
              onUpdateState={handleUpdateState}
            />
          )}
        </View>

        {screen !== 'login' && (
          <BottomNavBar
            activeTab={getActiveBottomTab()}
            onTabPress={handleBottomTabPress}
          />
        )}
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
