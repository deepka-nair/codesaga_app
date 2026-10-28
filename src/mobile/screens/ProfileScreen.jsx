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
  ActivityIndicator,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PixelCharacterAvatar from '../components/PixelCharacterAvatar';
import CharacterPicker from '../components/CharacterPicker';
import { getCharacterById } from '../../data/characterSprites';
import { saveCertificateToApi } from '../services/mobileApi';
import {
  fetchRealGithubProfile,
  validateGithubUsername,
  publishCertificateToGithub,
  publishProjectToGithub
} from '../../services/githubService';
import { checkCertificateEligibility } from '../../utils/certificateEligibility';
import { WORLD_CERTIFICATES, isWorldCompleted } from '../../utils/worldCertificates';
import mobileAudio from '../services/mobileAudio';

export default function ProfileScreen({ userState, initialTab = 'overview', onBack, onLogout, onUpdateState, onViewCertificate }) {
  const {
    user,
    isGuest,
    xp = 0,
    level = 1,
    coins = 70,
    hearts = 5,
    streak = 1,
    character = 'm1',
    completedMissions = [],
    completedChapters = [],
    unlockedChapters = [1],
    earnedAchievements = [],
    certificates = {},
    githubConnected = false,
    githubProfile = null
  } = userState;

  // Tabs: 'overview', 'github', 'certificates', 'character'
  const [activeTab, setActiveTab] = useState(initialTab);
  const [claiming, setClaiming] = useState(false);

  // GitHub state
  const [githubUsername, setGithubUsername] = useState(githubProfile?.login || '');
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState('');

  // Publishing Modals / States
  const [showProjectPublish, setShowProjectPublish] = useState(false);
  const [publishPat, setPublishPat] = useState('');
  const [publishRepoName, setPublishRepoName] = useState('codesaga-capstone');
  const [publishIsPrivate, setPublishIsPrivate] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);

  // Certificate Publishing State
  const [publishingCertWorld, setPublishingCertWorld] = useState(null);
  const [certPublishPat, setCertPublishPat] = useState('');
  const [certPublishRepo, setCertPublishRepo] = useState('codesaga-certificates');
  const [certPublishLoading, setCertPublishLoading] = useState(false);
  const [certPublishResult, setCertPublishResult] = useState(null);

  const activeChar = getCharacterById(character);
  const certEligibility = checkCertificateEligibility(userState);

  const handleConnectGithub = async () => {
    mobileAudio.playClick();
    setGithubError('');

    const validation = validateGithubUsername(githubUsername);
    if (!validation.valid) {
      setGithubError(validation.message);
      mobileAudio.playError();
      return;
    }

    setGithubLoading(true);
    try {
      const profile = await fetchRealGithubProfile(validation.cleanUsername);
      setGithubLoading(false);
      mobileAudio.playSuccess();

      if (onUpdateState) {
        onUpdateState({
          githubConnected: true,
          githubProfile: profile
        });
      }
      Alert.alert('✅ GITHUB CONNECTED!', `Successfully connected GitHub profile for @${profile.login}`);
    } catch (err) {
      setGithubLoading(false);
      mobileAudio.playError();
      setGithubError(err.message || 'GitHub connection failed.');
    }
  };

  const handleDisconnectGithub = () => {
    mobileAudio.playClick();
    if (onUpdateState) {
      onUpdateState({
        githubConnected: false,
        githubProfile: null
      });
    }
    setGithubUsername('');
    setGithubError('');
  };

  const handleClaimMainCertificate = async () => {
    // If certificate is already issued, open and view immediately
    if (certificates?.certificateIssued) {
      mobileAudio.playClick();
      if (onViewCertificate) {
        onViewCertificate({
          id: certificates.certificateId,
          certificateId: certificates.certificateId,
          issued_at: certificates.certificateIssuedAt,
          certificateIssuedAt: certificates.certificateIssuedAt,
          certificateName: certificates.certificateName || user?.username || user?.name || 'Detective'
        }, 'CODESAGA OFFICIAL CERTIFICATION');
      }
      return;
    }

    if (!certEligibility.isEligible) {
      mobileAudio.playError();
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
        mobileAudio.playLevelUp();
        const updatedCert = {
          ...certificates,
          certificateIssued: true,
          certificateId: certId,
          certificateIssuedAt: certIssuedAt,
          certificateName: user.name || user.username
        };
        if (onUpdateState) {
          onUpdateState({ certificates: updatedCert });
        }
        if (onViewCertificate) {
          onViewCertificate(updatedCert, 'CODESAGA OFFICIAL CERTIFICATION');
        }
      } else {
        mobileAudio.playError();
        Alert.alert('ERROR', res.message || 'Failed to save certificate.');
      }
    } catch (err) {
      setClaiming(false);
      mobileAudio.playError();
      Alert.alert('ERROR', 'Certificate claim request failed.');
    }
  };

  // Publish Capstone Project to GitHub
  const handlePublishProject = async () => {
    mobileAudio.playClick();
    if (!publishPat.trim()) {
      Alert.alert('PAT Required', 'Please enter your GitHub Personal Access Token (PAT) with "repo" scope.');
      return;
    }

    setPublishing(true);
    setPublishResult(null);

    try {
      const res = await publishProjectToGithub(
        publishPat.trim(),
        publishRepoName.trim() || 'codesaga-capstone',
        publishIsPrivate,
        {
          username: githubProfile?.login || user?.username,
          xp,
          level,
          completedMissions,
          completedChapters,
          unlockedChapters
        }
      );

      setPublishing(false);
      mobileAudio.playSuccess();
      setPublishResult({
        success: true,
        message: `Project successfully published to GitHub!`,
        url: res.html_url
      });
    } catch (err) {
      setPublishing(false);
      mobileAudio.playError();
      setPublishResult({
        success: false,
        message: err.message || 'Failed to publish project to GitHub.'
      });
    }
  };

  // Publish Individual Certificate to GitHub
  const handlePublishCertificate = async (certId, worldName, worldId) => {
    mobileAudio.playClick();
    if (!certPublishPat.trim()) {
      Alert.alert('PAT Required', 'Please enter your GitHub Personal Access Token (PAT) with "repo" scope to publish this certificate.');
      return;
    }

    setCertPublishLoading(true);
    setCertPublishResult(null);

    try {
      const res = await publishCertificateToGithub(certPublishPat.trim(), {
        repoName: certPublishRepo.trim() || 'codesaga-certificates',
        certData: { id: certId, worldId },
        studentName: user?.name || user?.username || 'Code Detective',
        worldName: worldName || 'CodeSaga World',
        isPrivate: false
      });

      setCertPublishLoading(false);
      mobileAudio.playSuccess();
      setCertPublishResult({
        success: true,
        message: `Certificate published to ${res.repoName}!`,
        url: res.fileUrl
      });
    } catch (err) {
      setCertPublishLoading(false);
      mobileAudio.playError();
      setCertPublishResult({
        success: false,
        message: err.message || 'Failed to publish certificate.'
      });
    }
  };

  const handleSelectChar = (newCharId) => {
    mobileAudio.playCharacterSelected();
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
              <Text style={styles.backButtonText}>← BACK</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>DETECTIVE DOSSIER</Text>
            <View style={{ width: 48 }} />
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabsBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'overview' && styles.activeTabItem]}
              onPress={() => { mobileAudio.playClick(); setActiveTab('overview'); }}
            >
              <Text style={[styles.tabItemText, activeTab === 'overview' && styles.activeTabItemText]}>OVERVIEW</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'github' && styles.activeTabItem]}
              onPress={() => { mobileAudio.playClick(); setActiveTab('github'); }}
            >
              <Text style={[styles.tabItemText, activeTab === 'github' && styles.activeTabItemText]}>GITHUB</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'certificates' && styles.activeTabItem]}
              onPress={() => { mobileAudio.playClick(); setActiveTab('certificates'); }}
            >
              <Text style={[styles.tabItemText, activeTab === 'certificates' && styles.activeTabItemText]}>DIPLOMAS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'character' && styles.activeTabItem]}
              onPress={() => { mobileAudio.playClick(); setActiveTab('character'); }}
            >
              <Text style={[styles.tabItemText, activeTab === 'character' && styles.activeTabItemText]}>AVATAR</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {/* Sleuth Profile Summary Header */}
            <View style={styles.pixelProfilePanel}>
              <View style={styles.avatarRow}>
                <PixelCharacterAvatar characterId={character} size={54} borderColor={activeChar.color} />
                <View style={styles.userTitleBox}>
                  <Text style={styles.userName}>{user?.name || user?.username || 'GUEST SLEUTH'}</Text>
                  <Text style={[styles.userBadge, { color: activeChar.color }]}>{activeChar.title.toUpperCase()}</Text>
                  <Text style={styles.userRole}>STATUS: {isGuest ? 'GUEST PREVIEW' : 'VERIFIED DETECTIVE'}</Text>
                </View>
              </View>

              {/* Stats Bar */}
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>XP</Text>
                  <Text style={styles.statVal}>{xp}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>LVL</Text>
                  <Text style={styles.statVal}>{level}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>COINS</Text>
                  <Text style={styles.statVal}>💰 {coins}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>STREAK</Text>
                  <Text style={styles.statVal}>🔥 {streak}D</Text>
                </View>
              </View>
            </View>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                <View style={styles.pixelSectionPanel}>
                  <Text style={styles.sectionTitle}>🏆 DETECTIVE PROGRESS</Text>
                  <Text style={styles.sectionDesc}>
                    Missions Solved: {completedMissions.length} • Chapters Mastered: {completedChapters.length}
                  </Text>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${Math.min(100, (xp % 500) / 5)}%` }]} />
                  </View>
                  <Text style={styles.progressNote}>{500 - (xp % 500)} XP to Next Detective Level</Text>
                </View>

                {/* Achievements List */}
                <View style={styles.pixelSectionPanel}>
                  <Text style={styles.sectionTitle}>🎖️ EARNED BADGES</Text>
                  <View style={styles.badgesGrid}>
                    <View style={[styles.badgeCard, completedMissions.length > 0 && styles.earnedBadge]}>
                      <Text style={styles.badgeIcon}>🔍</Text>
                      <Text style={styles.badgeName}>FIRST CASE</Text>
                      <Text style={styles.badgeDesc}>Solve your first coding mission</Text>
                    </View>
                    <View style={[styles.badgeCard, completedChapters.length > 0 && styles.earnedBadge]}>
                      <Text style={styles.badgeIcon}>📜</Text>
                      <Text style={styles.badgeName}>CHAPTER CLEARED</Text>
                      <Text style={styles.badgeDesc}>Complete any full curriculum chapter</Text>
                    </View>
                    <View style={[styles.badgeCard, certEligibility.isEligible && styles.earnedBadge]}>
                      <Text style={styles.badgeIcon}>🎓</Text>
                      <Text style={styles.badgeName}>GRAND SLAM</Text>
                      <Text style={styles.badgeDesc}>Qualify for CodeSaga Certification</Text>
                    </View>
                  </View>
                </View>

                {/* Sign Out Button */}
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
                  Connect your GitHub account to showcase your repositories, verify achievements, and publish your CodeSaga coding projects.
                </Text>

                {githubConnected && githubProfile ? (
                  <View style={styles.githubProfileCard}>
                    <View style={styles.githubHeaderRow}>
                      <Text style={styles.githubLoginText}>@{githubProfile.login}</Text>
                      <View style={styles.connectedBadge}>
                        <Text style={styles.connectedBadgeText}>✓ CONNECTED</Text>
                      </View>
                    </View>
                    <Text style={styles.githubBioText}>{githubProfile.bio || 'CodeSaga Sleuth & Developer'}</Text>
                    <View style={styles.githubStatsRow}>
                      <Text style={styles.githubStatItem}>📦 Repos: {githubProfile.public_repos || 0}</Text>
                      <Text style={styles.githubStatItem}>👥 Followers: {githubProfile.followers || 0}</Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.ghActionButtons}>
                      <TouchableOpacity
                        style={styles.publishProjectBtn}
                        onPress={() => setShowProjectPublish(!showProjectPublish)}
                      >
                        <Text style={styles.publishProjectBtnText}>
                          {showProjectPublish ? '✕ HIDE PUBLISHER' : '🚀 PUBLISH PROJECT TO GITHUB'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnectGithub}>
                        <Text style={styles.disconnectButtonText}>DISCONNECT</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Collapsible Project Publisher */}
                    {showProjectPublish && (
                      <View style={styles.publishBox}>
                        <Text style={styles.publishBoxTitle}>🚀 PUBLISH CODESAGA PROJECT</Text>
                        <Text style={styles.publishBoxDesc}>
                          Push your curriculum progress, solved cases, and documentation to an official GitHub repository under your account.
                        </Text>

                        <Text style={styles.inputLabel}>REPOSITORY NAME</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="codesaga-capstone"
                          placeholderTextColor="#64748b"
                          value={publishRepoName}
                          onChangeText={setPublishRepoName}
                          autoCapitalize="none"
                        />

                        <Text style={styles.inputLabel}>GITHUB PERSONAL ACCESS TOKEN (PAT)</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                          placeholderTextColor="#64748b"
                          value={publishPat}
                          onChangeText={setPublishPat}
                          secureTextEntry
                          autoCapitalize="none"
                        />
                        <Text style={styles.patHint}>
                          Requires a token with <Text style={{ color: '#38bdf8' }}>repo</Text> scope from github.com/settings/tokens. Tokens are used strictly in-memory for this upload and never stored on the backend.
                        </Text>

                        <TouchableOpacity
                          style={[styles.confirmPublishBtn, publishing && { opacity: 0.7 }]}
                          onPress={handlePublishProject}
                          disabled={publishing}
                        >
                          {publishing ? (
                            <ActivityIndicator color="#ffffff" />
                          ) : (
                            <Text style={styles.confirmPublishBtnText}>CONFIRM &amp; PUBLISH PROJECT →</Text>
                          )}
                        </TouchableOpacity>

                        {publishResult && (
                          <View style={[styles.resultBanner, publishResult.success ? styles.resultSuccess : styles.resultError]}>
                            <Text style={styles.resultText}>{publishResult.message}</Text>
                            {publishResult.url && (
                              <TouchableOpacity onPress={() => Linking.openURL(publishResult.url)}>
                                <Text style={styles.resultLink}>🔗 View Repository on GitHub ↗</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={styles.githubConnectBox}>
                    <Text style={styles.inputLabel}>GITHUB USERNAME</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your GitHub username"
                      placeholderTextColor="#64748b"
                      value={githubUsername}
                      onChangeText={(text) => {
                        setGithubUsername(text);
                        if (githubError) setGithubError('');
                      }}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />

                    {Boolean(githubError) && (
                      <View style={styles.errorBanner}>
                        <Text style={styles.errorBannerText}>⚠️ {githubError}</Text>
                      </View>
                    )}

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

            {/* TAB 3: CERTIFICATES & DIRECT GITHUB PUBLISHING */}
            {activeTab === 'certificates' && (
              <View style={styles.pixelSectionPanel}>
                <Text style={styles.sectionTitle}>🎓 CODESAGA CERTIFICATION</Text>
                <Text style={styles.sectionDesc}>{certEligibility.reason}</Text>

                <TouchableOpacity
                  style={[
                    styles.pixelCertButton,
                    !certEligibility.isEligible && !certificates?.certificateIssued && styles.lockedCertButton,
                    certificates?.certificateIssued && styles.claimedCertButton
                  ]}
                  onPress={handleClaimMainCertificate}
                  disabled={claiming || (!certEligibility.isEligible && !certificates?.certificateIssued)}
                >
                  {claiming ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.pixelCertButtonText}>
                      {certificates?.certificateIssued
                        ? `✅ CERTIFICATE ISSUED (${certificates.certificateId}) — TAP TO VIEW 📜`
                        : (certEligibility.isEligible ? '📜 CLAIM OFFICIAL CERTIFICATE' : '🔒 CERTIFICATE LOCKED')}
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Explicit Action Buttons for Claimed Certificate */}
                {certificates?.certificateIssued && (
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: '#14b8a6',
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderRadius: 6,
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: '#0d9488'
                      }}
                      onPress={() => {
                        mobileAudio.playClick();
                        if (onViewCertificate) {
                          onViewCertificate({
                            id: certificates.certificateId,
                            certificateId: certificates.certificateId,
                            issued_at: certificates.certificateIssuedAt,
                            certificateIssuedAt: certificates.certificateIssuedAt,
                            name: certificates.certificateName || user?.username || user?.name || 'Detective'
                          }, 'CODESAGA OFFICIAL CERTIFICATION');
                        }
                      }}
                    >
                      <Text style={{ fontFamily: 'PressStart2P', color: '#0a0e17', fontSize: 9 }}>
                        👁️ VIEW CERTIFICATE
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        backgroundColor: '#24292e',
                        paddingVertical: 10,
                        paddingHorizontal: 14,
                        borderRadius: 6,
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: '#444c56'
                      }}
                      onPress={() => {
                        setCertPublishResult(null);
                        setPublishingCertWorld({
                          id: certificates.certificateId,
                          name: 'CODESAGA OFFICIAL CERTIFICATION',
                          worldId: 'main'
                        });
                      }}
                    >
                      <Text style={{ fontFamily: 'PressStart2P', color: '#ffffff', fontSize: 9 }}>
                        🐙 PUBLISH
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Direct Certificate Publishing Panel if a world is selected for publishing */}
                {publishingCertWorld && (
                  <View style={styles.certPublishBox}>
                    <View style={styles.certPublishHeader}>
                      <Text style={styles.certPublishTitle}>🐙 PUBLISH CERTIFICATE TO GITHUB</Text>
                      <TouchableOpacity onPress={() => setPublishingCertWorld(null)}>
                        <Text style={styles.certPublishClose}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.certPublishSub}>
                      Publishing: <Text style={{ color: '#eab308', fontWeight: 'bold' }}>{publishingCertWorld.name}</Text>
                    </Text>

                    <Text style={styles.inputLabel}>REPOSITORY NAME</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="codesaga-certificates"
                      placeholderTextColor="#64748b"
                      value={certPublishRepo}
                      onChangeText={setCertPublishRepo}
                      autoCapitalize="none"
                    />

                    <Text style={styles.inputLabel}>GITHUB PERSONAL ACCESS TOKEN (PAT)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      placeholderTextColor="#64748b"
                      value={certPublishPat}
                      onChangeText={setCertPublishPat}
                      secureTextEntry
                      autoCapitalize="none"
                    />

                    <TouchableOpacity
                      style={[styles.confirmPublishBtn, certPublishLoading && { opacity: 0.7 }]}
                      onPress={() => handlePublishCertificate(publishingCertWorld.id, publishingCertWorld.name, publishingCertWorld.worldId)}
                      disabled={certPublishLoading}
                    >
                      {certPublishLoading ? (
                        <ActivityIndicator color="#ffffff" />
                      ) : (
                        <Text style={styles.confirmPublishBtnText}>UPLOAD CERTIFICATE TO GITHUB →</Text>
                      )}
                    </TouchableOpacity>

                    {certPublishResult && (
                      <View style={[styles.resultBanner, certPublishResult.success ? styles.resultSuccess : styles.resultError]}>
                        <Text style={styles.resultText}>{certPublishResult.message}</Text>
                        {certPublishResult.url && (
                          <TouchableOpacity onPress={() => Linking.openURL(certPublishResult.url)}>
                            <Text style={styles.resultLink}>🔗 View Certificate on GitHub ↗</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                )}

                {/* 6 Saga World Certificates List */}
                <View style={styles.worldCertsBox}>
                  <Text style={styles.worldCertsTitle}>SAGA WORLD CERTIFICATES</Text>

                  {/* Master Verified Certificate if issued */}
                  {certificates?.certificateIssued && (
                    <View style={styles.worldCertItemContainer}>
                      <TouchableOpacity
                        style={[styles.worldCertItem, { borderColor: '#eab308', backgroundColor: 'rgba(234, 179, 8, 0.12)' }]}
                        onPress={() => {
                          if (onViewCertificate) {
                            onViewCertificate({
                              id: certificates.certificateId,
                              certificateId: certificates.certificateId,
                              issued_at: certificates.certificateIssuedAt,
                              certificateIssuedAt: certificates.certificateIssuedAt,
                              name: certificates.certificateName || user?.username || user?.name || 'Detective'
                            }, 'CODESAGA OFFICIAL CERTIFICATION');
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.worldCertName}>👑 MASTER CERTIFICATION</Text>
                        <Text style={[styles.worldCertStatus, { color: '#eab308', fontWeight: '700' }]}>
                          ID: {certificates.certificateId} (VERIFIED ✓)
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.certGhBtn}
                        onPress={() => {
                          setCertPublishResult(null);
                          setPublishingCertWorld({
                            id: certificates.certificateId,
                            name: 'CODESAGA OFFICIAL CERTIFICATION',
                            worldId: 'main'
                          });
                        }}
                      >
                        <Text style={styles.certGhBtnText}>🐙 PUBLISH</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {Object.keys(WORLD_CERTIFICATES).map((wId) => {
                    const wConfig = WORLD_CERTIFICATES[wId];
                    const isDone = isWorldCompleted(wId, userState);
                    const savedCert = certificates?.worldCertificates?.[wId];
                    const certId = savedCert?.id || `${wConfig.codePrefix}-EARNED`;

                    return (
                      <View key={wId} style={styles.worldCertItemContainer}>
                        <TouchableOpacity
                          style={styles.worldCertItem}
                          onPress={() => {
                            if ((savedCert || isDone) && onViewCertificate) {
                              onViewCertificate(savedCert || { id: certId }, wConfig.name);
                            } else {
                              mobileAudio.playError();
                              Alert.alert(
                                '🔒 CERTIFICATE LOCKED',
                                `You must complete all missions in ${wConfig.name} before this certificate is issued.`
                              );
                            }
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.worldCertName}>{wConfig.badge} {wConfig.name}</Text>
                          <Text style={[styles.worldCertStatus, isDone && { color: '#4ade80', fontWeight: '700' }]}>
                            {savedCert ? `ID: ${savedCert.id}` : (isDone ? 'EARNED ✓ (TAP TO VIEW)' : 'LOCKED 🔒')}
                          </Text>
                        </TouchableOpacity>

                        {(savedCert || isDone) && (
                          <TouchableOpacity
                            style={styles.certGhBtn}
                            onPress={() => {
                              setCertPublishResult(null);
                              setPublishingCertWorld({ id: certId, name: wConfig.name, worldId: wId });
                            }}
                          >
                            <Text style={styles.certGhBtnText}>🐙 PUBLISH</Text>
                          </TouchableOpacity>
                        )}
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
    fontSize: 10,
    marginBottom: 3
  },
  userBadge: {
    fontFamily: 'PressStart2P',
    fontSize: 7,
    marginBottom: 3
  },
  userRole: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 11
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  statLabel: {
    fontFamily: 'PressStart2P',
    color: '#64748b',
    fontSize: 6,
    marginBottom: 3
  },
  statVal: {
    fontFamily: 'PressStart2P',
    color: '#f8fafc',
    fontSize: 8
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
    color: '#14b8a6',
    fontSize: 8,
    marginBottom: 6
  },
  sectionDesc: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#0f172a',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 6
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#14b8a6',
    borderRadius: 5
  },
  progressNote: {
    fontFamily: 'Outfit',
    color: '#64748b',
    fontSize: 11,
    textAlign: 'right'
  },
  badgesGrid: {
    gap: 8
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155',
    opacity: 0.6
  },
  earnedBadge: {
    opacity: 1,
    borderColor: '#14b8a6',
    backgroundColor: 'rgba(20, 184, 166, 0.08)'
  },
  badgeIcon: {
    fontSize: 22,
    marginRight: 10
  },
  badgeName: {
    fontFamily: 'PressStart2P',
    color: '#f8fafc',
    fontSize: 7,
    marginBottom: 2
  },
  badgeDesc: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 11
  },
  logoutPixelButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 2,
    borderColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8
  },
  logoutPixelButtonText: {
    fontFamily: 'PressStart2P',
    color: '#ef4444',
    fontSize: 7
  },
  githubProfileCard: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 14,
    borderWidth: 2,
    borderColor: '#22c55e',
    marginTop: 6
  },
  githubHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  githubLoginText: {
    fontFamily: 'PressStart2P',
    color: '#22c55e',
    fontSize: 9
  },
  connectedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#22c55e'
  },
  connectedBadgeText: {
    fontFamily: 'PressStart2P',
    color: '#22c55e',
    fontSize: 6
  },
  githubBioText: {
    fontFamily: 'Outfit',
    color: '#cbd5e1',
    fontSize: 12,
    marginBottom: 8
  },
  githubStatsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 12
  },
  githubStatItem: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 12
  },
  ghActionButtons: {
    flexDirection: 'column',
    gap: 8
  },
  publishProjectBtn: {
    backgroundColor: '#10b981',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#34d399'
  },
  publishProjectBtnText: {
    fontFamily: 'PressStart2P',
    color: '#022c22',
    fontSize: 7
  },
  disconnectButton: {
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center'
  },
  disconnectButtonText: {
    fontFamily: 'PressStart2P',
    color: '#ef4444',
    fontSize: 7
  },
  publishBox: {
    marginTop: 12,
    backgroundColor: '#071516',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#10b981'
  },
  publishBoxTitle: {
    fontFamily: 'PressStart2P',
    color: '#34d399',
    fontSize: 7,
    marginBottom: 4
  },
  publishBoxDesc: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 15
  },
  patHint: {
    fontFamily: 'Outfit',
    color: '#64748b',
    fontSize: 10,
    marginBottom: 10,
    lineHeight: 14
  },
  confirmPublishBtn: {
    backgroundColor: '#10b981',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center'
  },
  confirmPublishBtnText: {
    fontFamily: 'PressStart2P',
    color: '#022c22',
    fontSize: 7
  },
  resultBanner: {
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1
  },
  resultSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981'
  },
  resultError: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444'
  },
  resultText: {
    fontFamily: 'Outfit',
    color: '#f8fafc',
    fontSize: 12,
    marginBottom: 4
  },
  resultLink: {
    fontFamily: 'PressStart2P',
    color: '#38bdf8',
    fontSize: 7,
    textDecorationLine: 'underline'
  },
  githubConnectBox: {
    marginTop: 6
  },
  inputLabel: {
    fontFamily: 'PressStart2P',
    color: '#94a3b8',
    fontSize: 7,
    marginBottom: 6
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#334155',
    color: '#f8fafc',
    fontFamily: 'Outfit',
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#ef4444',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10
  },
  errorBannerText: {
    fontFamily: 'Outfit',
    color: '#fca5a5',
    fontSize: 11
  },
  pixelButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  pixelButtonText: {
    fontFamily: 'PressStart2P',
    color: '#022c22',
    fontSize: 7
  },
  pixelCertButton: {
    backgroundColor: '#eab308',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 14
  },
  lockedCertButton: {
    backgroundColor: '#334155'
  },
  claimedCertButton: {
    backgroundColor: '#059669'
  },
  pixelCertButtonText: {
    fontFamily: 'PressStart2P',
    color: '#0f172a',
    fontSize: 7
  },
  certPublishBox: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: '#eab308',
    marginBottom: 14
  },
  certPublishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  certPublishTitle: {
    fontFamily: 'PressStart2P',
    color: '#eab308',
    fontSize: 7
  },
  certPublishClose: {
    fontFamily: 'PressStart2P',
    color: '#94a3b8',
    fontSize: 10
  },
  certPublishSub: {
    fontFamily: 'Outfit',
    color: '#cbd5e1',
    fontSize: 11,
    marginBottom: 10
  },
  worldCertsBox: {
    gap: 8
  },
  worldCertsTitle: {
    fontFamily: 'PressStart2P',
    color: '#64748b',
    fontSize: 7,
    marginBottom: 4
  },
  worldCertItemContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center'
  },
  worldCertItem: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  certGhBtn: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    borderWidth: 1,
    borderColor: '#eab308',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  certGhBtnText: {
    fontFamily: 'PressStart2P',
    color: '#eab308',
    fontSize: 6
  },
  worldCertName: {
    fontFamily: 'Outfit-Bold',
    color: '#f8fafc',
    fontSize: 12,
    marginBottom: 2
  },
  worldCertStatus: {
    fontFamily: 'PressStart2P',
    color: '#64748b',
    fontSize: 6
  },
  activeCharPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: 12
  },
  activeCharInfo: {
    flex: 1
  },
  activeCharName: {
    fontFamily: 'PressStart2P',
    color: '#f8fafc',
    fontSize: 9,
    marginBottom: 3
  },
  activeCharTitle: {
    fontFamily: 'PressStart2P',
    fontSize: 7,
    marginBottom: 4
  },
  activeCharQuote: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 11,
    fontStyle: 'italic'
  }
});
