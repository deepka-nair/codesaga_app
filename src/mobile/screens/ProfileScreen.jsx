import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PixelCharacterAvatar from '../components/PixelCharacterAvatar';
import CharacterPicker from '../components/CharacterPicker';
import { getCharacterById } from '../../data/characterSprites';
import { saveCertificateToApi } from '../services/mobileApi';
import { fetchRealGithubProfile } from '../../services/githubService';
import { checkCertificateEligibility } from '../../utils/certificateEligibility';
import { WORLD_CERTIFICATES, isWorldCompleted } from '../../utils/worldCertificates';

export default function ProfileScreen({ userState, initialTab = 'overview', onBack, onLogout, onUpdateState }) {
  const {
    user,
    isGuest,
    xp = 0,
    level = 1,
    coins = 70,
    hearts = 5,
    streak = 1,
    character = 'm1',
    earnedAchievements = [],
    certificates = {},
    githubConnected = false,
    githubProfile = null
  } = userState;

  // Tabs: 'overview', 'github', 'certificates', 'character'
  const [activeTab, setActiveTab] = useState(initialTab);
  const [claiming, setClaiming] = useState(false);

  // GitHub state
  const [githubUsername, setGithubUsername] = useState('deepka-nair');
  const [githubLoading, setGithubLoading] = useState(false);

  const activeChar = getCharacterById(character);
  const certEligibility = checkCertificateEligibility(userState);

  const handleConnectGithub = async () => {
    if (!githubUsername.trim()) return;
    setGithubLoading(true);

    try {
      const profile = await fetchRealGithubProfile(githubUsername.trim());
      setGithubLoading(false);
      if (onUpdateState) {
        onUpdateState({
          githubConnected: true,
          githubProfile: profile
        });
      }
      Alert.alert('✅ GITHUB CONNECTED!', `Successfully connected GitHub profile for @${profile.login}`);
    } catch (err) {
      setGithubLoading(false);
      Alert.alert('ERROR', err.message || 'GitHub connection failed.');
    }
  };

  const handleDisconnectGithub = () => {
    if (onUpdateState) {
      onUpdateState({
        githubConnected: false,
        githubProfile: null
      });
    }
  };

  const handleClaimMainCertificate = async () => {
    if (!certEligibility.isEligible) {
      Alert.alert('🔒 CERTIFICATE LOCKED', certEligibility.reason);
      return;
    }

    const certId = certificates?.certificateId || `CS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const certIssuedAt = certificates?.certificateIssuedAt || new Date().toISOString();

    setClaiming(true);
    try {
      const res = await saveCertificateToApi(user.email, {
        certificateId: certId,
        certificateIssuedAt: certIssuedAt,
        certificateName: user.name || user.username
      });

      setClaiming(false);
      if (res.success) {
        Alert.alert('🎓 CERTIFICATE ISSUED!', `Certificate ID: ${certId}\nIssued to: ${user.name || user.email}`);
        if (onUpdateState) {
          onUpdateState({
            certificates: {
              ...certificates,
              certificateIssued: true,
              certificateId: certId,
              certificateIssuedAt: certIssuedAt
            }
          });
        }
      } else {
        Alert.alert('ERROR', res.message || 'Failed to save certificate.');
      }
    } catch (err) {
      setClaiming(false);
      Alert.alert('ERROR', 'Certificate claim request failed.');
    }
  };

  const handleSelectChar = (newCharId) => {
    if (onUpdateState) {
      onUpdateState({ character: newCharId });
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/login-bg.jpg')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>← DASHBOARD</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>SLEUTH CHARACTER SHEET</Text>
          </View>

          {/* Tabs Selector Bar */}
          <View style={styles.tabsBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'overview' && styles.activeTabItem]}
              onPress={() => setActiveTab('overview')}
            >
              <Text style={[styles.tabItemText, activeTab === 'overview' && styles.activeTabItemText]}>OVERVIEW</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'github' && styles.activeTabItem]}
              onPress={() => setActiveTab('github')}
            >
              <Text style={[styles.tabItemText, activeTab === 'github' && styles.activeTabItemText]}>GITHUB</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'certificates' && styles.activeTabItem]}
              onPress={() => setActiveTab('certificates')}
            >
              <Text style={[styles.tabItemText, activeTab === 'certificates' && styles.activeTabItemText]}>CERTS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'character' && styles.activeTabItem]}
              onPress={() => setActiveTab('character')}
            >
              <Text style={[styles.tabItemText, activeTab === 'character' && styles.activeTabItemText]}>AVATAR</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                {/* Profile Character Sheet Card */}
                <View style={styles.pixelProfilePanel}>
                  <View style={styles.avatarRow}>
                    <PixelCharacterAvatar characterId={character} size={56} borderColor={activeChar.color} />
                    <View style={styles.userTitleBox}>
                      <Text style={styles.userName}>{user?.name || activeChar.name}</Text>
                      <Text style={[styles.charTitle, { color: activeChar.color }]}>{activeChar.title}</Text>
                      <Text style={styles.userEmail}>{user?.email || 'Guest Session (Offline)'}</Text>
                    </View>
                  </View>

                  <View style={styles.roleBadge}>
                    <Text style={styles.roleBadgeText}>
                      {isGuest ? 'GUEST SLEUTH' : (user?.role === 'developer' ? 'DEVELOPER' : 'REGISTERED SLEUTH')}
                    </Text>
                  </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>LEVEL</Text>
                    <Text style={styles.statValLevel}>Lvl {level}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>XP</Text>
                    <Text style={styles.statValXp}>⚡ {xp}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>COINS</Text>
                    <Text style={styles.statValCoins}>🪙 {coins}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>STREAK</Text>
                    <Text style={styles.statValStreak}>🔥 {streak}d</Text>
                  </View>
                </View>

                {/* Achievements Section */}
                <View style={styles.pixelSectionPanel}>
                  <Text style={styles.sectionTitle}>🏆 EARNED ACHIEVEMENTS</Text>
                  {earnedAchievements.length === 0 ? (
                    <Text style={styles.emptyText}>No achievements unlocked yet. Complete missions in any world to earn badges!</Text>
                  ) : (
                    <View style={styles.achievementsList}>
                      {earnedAchievements.map((ach, idx) => (
                        <View key={idx} style={styles.achievementBadge}>
                          <Text style={styles.achievementText}>⭐ {ach}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                {/* Sign Out */}
                <TouchableOpacity style={styles.logoutPixelButton} onPress={onLogout}>
                  <Text style={styles.logoutPixelButtonText}>🚪 SIGN OUT OF CODESAGA</Text>
                </TouchableOpacity>
              </>
            )}

            {/* TAB 2: GITHUB CAREER CREDENTIALS */}
            {activeTab === 'github' && (
              <View style={styles.pixelSectionPanel}>
                <Text style={styles.sectionTitle}>🐙 GITHUB CAREER CREDENTIALS</Text>
                <Text style={styles.sectionDesc}>
                  Connect your GitHub account to showcase your public repositories, code contributions, and CodeSaga achievements.
                </Text>

                {githubConnected && githubProfile ? (
                  <View style={styles.githubProfileCard}>
                    <Text style={styles.githubLoginText}>@{githubProfile.login}</Text>
                    <Text style={styles.githubBioText}>{githubProfile.bio || 'CodeSaga Sleuth & Developer'}</Text>
                    <View style={styles.githubStatsRow}>
                      <Text style={styles.githubStatItem}>📦 Repos: {githubProfile.public_repos || 0}</Text>
                      <Text style={styles.githubStatItem}>👥 Followers: {githubProfile.followers || 0}</Text>
                    </View>

                    <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnectGithub}>
                      <Text style={styles.disconnectButtonText}>DISCONNECT GITHUB</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.githubConnectBox}>
                    <Text style={styles.label}>ENTER GITHUB USERNAME</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="deepka-nair"
                      placeholderTextColor="#64748b"
                      value={githubUsername}
                      onChangeText={setGithubUsername}
                      autoCapitalize="none"
                    />

                    <TouchableOpacity
                      style={styles.pixelButton}
                      onPress={handleConnectGithub}
                      disabled={githubLoading}
                    >
                      {githubLoading ? (
                        <ActivityIndicator color="#ffffff" />
                      ) : (
                        <Text style={styles.pixelButtonText}>CONNECT GITHUB PROFILE →</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* TAB 3: CERTIFICATES (EXACT LOGIC PARITY) */}
            {activeTab === 'certificates' && (
              <View style={styles.pixelSectionPanel}>
                <Text style={styles.sectionTitle}>🎓 CODESAGA CERTIFICATION</Text>
                <Text style={styles.sectionDesc}>{certEligibility.reason}</Text>

                <TouchableOpacity
                  style={[
                    styles.pixelCertButton,
                    !certEligibility.isEligible && styles.lockedCertButton,
                    certificates?.certificateIssued && styles.claimedCertButton
                  ]}
                  onPress={handleClaimMainCertificate}
                  disabled={claiming || !certEligibility.isEligible}
                >
                  {claiming ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.pixelCertButtonText}>
                      {certificates?.certificateIssued
                        ? `✅ CERTIFICATE ISSUED (${certificates.certificateId})`
                        : (certEligibility.isEligible ? '📜 CLAIM OFFICIAL CERTIFICATE' : '🔒 CERTIFICATE LOCKED')}
                    </Text>
                  )}
                </TouchableOpacity>

                {/* 6 Saga World Certificates List */}
                <View style={styles.worldCertsBox}>
                  <Text style={styles.worldCertsTitle}>SAGA WORLD CERTIFICATES</Text>
                  {Object.keys(WORLD_CERTIFICATES).map((wId) => {
                    const wConfig = WORLD_CERTIFICATES[wId];
                    const isDone = isWorldCompleted(wId, userState);
                    const savedCert = certificates?.worldCertificates?.[wId];

                    return (
                      <View key={wId} style={styles.worldCertItem}>
                        <Text style={styles.worldCertName}>{wConfig.badge} {wConfig.name}</Text>
                        <Text style={[styles.worldCertStatus, isDone && { color: '#4ade80', fontWeight: '700' }]}>
                          {savedCert ? `ID: ${savedCert.id}` : (isDone ? 'EARNED ✓' : 'LOCKED 🔒')}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* TAB 4: CHARACTER SELECTOR */}
            {activeTab === 'character' && (
              <View style={styles.pixelSectionPanel}>
                <Text style={styles.sectionTitle}>🎭 DETECTIVE CHARACTER SELECTION</Text>
                <Text style={styles.sectionDesc}>
                  Select your active field avatar sprite. Your choice updates your HUD badge, dialogs, and profile card.
                </Text>

                <CharacterPicker selectedId={character} onSelectCharacter={handleSelectChar} />

                <View style={styles.activeCharPreview}>
                  <PixelCharacterAvatar characterId={character} size={64} borderColor={activeChar.color} />
                  <View style={styles.activeCharInfo}>
                    <Text style={styles.activeCharName}>{activeChar.name}</Text>
                    <Text style={[styles.activeCharTitle, { color: activeChar.color }]}>{activeChar.title}</Text>
                    <Text style={styles.activeCharQuote}>"{activeChar.quote}"</Text>
                  </View>
                </View>
              </View>
            )}
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
    backgroundColor: 'rgba(10, 14, 23, 0.82)'
  },
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderBottomWidth: 4,
    borderBottomColor: '#1e293b'
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#334155'
  },
  backButtonText: {
    fontFamily: 'PressStart2P',
    color: '#94a3b8',
    fontSize: 8
  },
  headerTitle: {
    fontFamily: 'PressStart2P',
    color: '#f8fafc',
    fontSize: 9
  },
  tabsBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderBottomWidth: 2,
    borderBottomColor: '#1e293b'
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent'
  },
  activeTabItem: {
    borderBottomColor: '#14b8a6',
    backgroundColor: '#1e293b'
  },
  tabItemText: {
    fontFamily: 'PressStart2P',
    color: '#64748b',
    fontSize: 7
  },
  activeTabItemText: {
    color: '#14b8a6'
  },
  scrollContent: {
    padding: 14
  },
  pixelProfilePanel: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 4,
    borderColor: '#1e293b',
    marginBottom: 14
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10
  },
  userTitleBox: {
    flex: 1
  },
  userName: {
    fontFamily: 'PressStart2P',
    color: '#f8fafc',
    fontSize: 11
  },
  charTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 12,
    marginTop: 2
  },
  userEmail: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2
  },
  roleBadge: {
    backgroundColor: '#1e1b4b',
    borderColor: '#4338ca',
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start'
  },
  roleBadgeText: {
    fontFamily: 'PressStart2P',
    color: '#818cf8',
    fontSize: 7
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 2,
    borderColor: '#1e293b'
  },
  statLabel: {
    fontFamily: 'PressStart2P',
    color: '#64748b',
    fontSize: 7,
    marginBottom: 4
  },
  statValLevel: {
    fontFamily: 'PressStart2P',
    color: '#14b8a6',
    fontSize: 9
  },
  statValXp: {
    fontFamily: 'PressStart2P',
    color: '#3b82f6',
    fontSize: 9
  },
  statValCoins: {
    fontFamily: 'PressStart2P',
    color: '#f59e0b',
    fontSize: 9
  },
  statValStreak: {
    fontFamily: 'PressStart2P',
    color: '#f97316',
    fontSize: 9
  },
  pixelSectionPanel: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 4,
    borderColor: '#1e293b',
    marginBottom: 14
  },
  sectionTitle: {
    fontFamily: 'PressStart2P',
    color: '#f8fafc',
    fontSize: 9,
    marginBottom: 8
  },
  sectionDesc: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12
  },
  pixelCertButton: {
    backgroundColor: '#14b8a6',
    borderWidth: 3,
    borderColor: '#0f766e',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center'
  },
  lockedCertButton: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    opacity: 0.8
  },
  claimedCertButton: {
    backgroundColor: '#166534',
    borderColor: '#14532d'
  },
  pixelCertButtonText: {
    fontFamily: 'PressStart2P',
    color: '#ffffff',
    fontSize: 8
  },
  worldCertsBox: {
    marginTop: 16,
    gap: 6
  },
  worldCertsTitle: {
    fontFamily: 'PressStart2P',
    color: '#f59e0b',
    fontSize: 8,
    marginBottom: 4
  },
  worldCertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155'
  },
  worldCertName: {
    fontFamily: 'PressStart2P',
    color: '#f8fafc',
    fontSize: 7
  },
  worldCertStatus: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 11
  },
  emptyText: {
    fontFamily: 'Outfit',
    color: '#64748b',
    fontSize: 12,
    fontStyle: 'italic'
  },
  achievementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  achievementBadge: {
    backgroundColor: '#1e293b',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#334155'
  },
  achievementText: {
    fontFamily: 'PressStart2P',
    color: '#f59e0b',
    fontSize: 8
  },
  githubProfileCard: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: '#334155'
  },
  githubLoginText: {
    fontFamily: 'PressStart2P',
    color: '#14b8a6',
    fontSize: 10,
    marginBottom: 4
  },
  githubBioText: {
    fontFamily: 'Outfit',
    color: '#cbd5e1',
    fontSize: 12,
    marginBottom: 8
  },
  githubStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10
  },
  githubStatItem: {
    fontFamily: 'Outfit-Bold',
    color: '#94a3b8',
    fontSize: 12
  },
  disconnectButton: {
    backgroundColor: '#3f1818',
    borderColor: '#7f1d1d',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center'
  },
  disconnectButtonText: {
    fontFamily: 'PressStart2P',
    color: '#fca5a5',
    fontSize: 7
  },
  githubConnectBox: {
    gap: 8
  },
  label: {
    fontFamily: 'PressStart2P',
    color: '#94a3b8',
    fontSize: 8
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
    paddingVertical: 8
  },
  pixelButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center'
  },
  pixelButtonText: {
    fontFamily: 'PressStart2P',
    color: '#0a0e17',
    fontSize: 8
  },
  activeCharPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: '#334155',
    marginTop: 12
  },
  activeCharInfo: {
    flex: 1
  },
  activeCharName: {
    fontFamily: 'PressStart2P',
    color: '#f8fafc',
    fontSize: 10
  },
  activeCharTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 12,
    marginTop: 2
  },
  activeCharQuote: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4
  },
  logoutPixelButton: {
    backgroundColor: '#451a03',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#9a3412',
    marginTop: 6,
    marginBottom: 20
  },
  logoutPixelButtonText: {
    fontFamily: 'PressStart2P',
    color: '#fca5a5',
    fontSize: 9
  }
});
