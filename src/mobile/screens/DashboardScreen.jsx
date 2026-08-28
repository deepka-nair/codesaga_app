import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PixelCharacterAvatar from '../components/PixelCharacterAvatar';
import { getCharacterById } from '../../data/characterSprites';

const WORLDS = [
  {
    id: 'sql',
    name: 'DATABASE DETECTIVE CITY',
    language: 'SQL',
    guide: 'Detective Aria Silver',
    description: 'Solve crime mysteries using relational SQL queries in a cyberpunk detective city.',
    icon: '🕵️',
    color: '#06b6d4',
    totalChapters: 14
  },
  {
    id: 'python',
    name: 'PYTHON VALLEY',
    language: 'Python',
    guide: 'Aiden & Byte',
    description: 'Master Python fundamentals, OOP, collections, file I/O, and build the Robot Management Capstone.',
    icon: '🐍',
    color: '#22c55e',
    totalChapters: 12
  },
  {
    id: 'java',
    name: 'JAVA KINGDOM',
    language: 'Java',
    guide: 'Jax',
    description: 'Master Java primitives, operators, control flow, methods, OOP inheritance, and the Grade Manager Capstone.',
    icon: '☕',
    color: '#f59e0b',
    totalChapters: 12
  },
  {
    id: 'frontend',
    name: 'WEB CREATOR CITY',
    language: 'Frontend',
    guide: 'Pixel',
    description: 'Master HTML5, CSS3, Flexbox, Grid, JavaScript, DOM events, APIs, and the Developer Dashboard Capstone.',
    icon: '🌐',
    color: '#0ea5e9',
    totalChapters: 12
  },
  {
    id: 'cpp',
    name: 'C++ CYBER ARENA',
    language: 'C++',
    guide: 'Vector',
    description: 'Master C++ I/O streams, pointers, memory addresses, references, OOP inheritance, STL, and Player Manager Capstone.',
    icon: '⚡',
    color: '#a855f7',
    totalChapters: 12
  },
  {
    id: 'backend',
    name: 'SERVER FORTRESS',
    language: 'Backend',
    guide: 'Server',
    description: 'Master Node.js, Express, REST APIs, Databases, Validation, Auth, JWT, Security, and CodeSaga Backend Capstone.',
    icon: '⚙️',
    color: '#ef4444',
    totalChapters: 12
  }
];

export default function DashboardScreen({ userState, onSelectWorld, onOpenProfile, onLogout }) {
  const {
    user,
    isGuest,
    xp = 0,
    level = 1,
    coins = 70,
    hearts = 5,
    streak = 1,
    character = 'm1',
    completedMissions = []
  } = userState;

  const activeChar = getCharacterById(character);

  // XP progress inside current level (500 XP per level)
  const currentXpProgress = xp % 500;
  const xpPercentage = Math.min(100, Math.max(0, (currentXpProgress / 500) * 100));

  return (
    <ImageBackground
      source={require('../../../assets/images/login-bg.jpg')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          {/* Top Header */}
          <View style={styles.topNav}>
            <Image
              source={require('../../../assets/splash.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.profileBadge} onPress={onOpenProfile}>
              <PixelCharacterAvatar characterId={character} size={24} borderColor={activeChar.color} />
              <Text style={styles.profileBadgeText}>{activeChar.name}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Game HUD Bar (Exact Web/APK Design) */}
            <View style={styles.hudContainer}>
              <TouchableOpacity style={styles.hudAvatarBox} onPress={onOpenProfile}>
                <PixelCharacterAvatar characterId={character} size={28} borderColor={activeChar.color} />
                <Text style={styles.hudCharName}>{user?.name || activeChar.name}</Text>
              </TouchableOpacity>

              {/* Level & XP */}
              <View style={styles.hudXpBox}>
                <View style={styles.hudXpHeader}>
                  <Text style={styles.hudLevelText}>LV {level}</Text>
                  <Text style={styles.hudXpText}>{xp} XP</Text>
                </View>
                <View style={styles.hudXpTrack}>
                  <View style={[styles.hudXpFill, { width: `${xpPercentage}%` }]} />
                </View>
              </View>

              {/* Stats Badges */}
              <View style={styles.hudStatsRow}>
                <View style={styles.hudStatItem}>
                  <Text style={styles.hudStatIcon}>💰</Text>
                  <Text style={styles.hudStatCoins}>{coins}</Text>
                </View>

                <View style={styles.hudStatItem}>
                  <Text style={styles.hudStatIcon}>🔥</Text>
                  <Text style={styles.hudStatStreak}>{streak}</Text>
                </View>

                <View style={styles.hudStatItem}>
                  <Text style={styles.hudStatIcon}>❤️</Text>
                  <Text style={styles.hudStatHearts}>{hearts}</Text>
                </View>
              </View>
            </View>

            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>CHOOSE YOUR WORLD</Text>
              <Text style={styles.sectionSubtitle}>Select a coding adventure world to begin your detective quests.</Text>
            </View>

            {/* Worlds Grid */}
            <View style={styles.worldsGrid}>
              {WORLDS.map((world) => {
                const worldCompletedCount = completedMissions.filter((mId) =>
                  String(mId).toLowerCase().startsWith(world.id.toLowerCase())
                ).length;

                return (
                  <TouchableOpacity
                    key={world.id}
                    style={[styles.pixelWorldPanel, { borderColor: world.color }]}
                    onPress={() => onSelectWorld(world.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.worldCardHeader}>
                      <Text style={styles.worldIcon}>{world.icon}</Text>
                      <View style={styles.worldTitleBox}>
                        <Text style={[styles.worldMetaTag, { color: world.color }]}>WORLD • {world.language.toUpperCase()}</Text>
                        <Text style={styles.worldName}>{world.name}</Text>
                        <Text style={styles.worldGuideText}>Guide: {world.guide}</Text>
                      </View>
                    </View>

                    <Text style={styles.worldDesc} numberOfLines={2}>
                      {world.description}
                    </Text>

                    <View style={styles.worldFooter}>
                      <Text style={styles.worldMeta}>
                        {worldCompletedCount === 0 ? 'Not started' : `${worldCompletedCount} / ${world.totalChapters} chapters`}
                      </Text>
                      <View style={[styles.pixelButtonBadge, { backgroundColor: world.color }]}>
                        <Text style={styles.pixelButtonBadgeText}>
                          {worldCompletedCount > 0 ? `CONTINUE ${world.language.toUpperCase()} →` : `START ${world.language.toUpperCase()} →`}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Footer Actions */}
            <View style={styles.footerBox}>
              <TouchableOpacity style={styles.secondaryPixelButton} onPress={onOpenProfile}>
                <Text style={styles.secondaryPixelButtonText}>🏆 VIEW PROFILE & CERTIFICATES</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.logoutPixelButton} onPress={onLogout}>
                <Text style={styles.logoutPixelButtonText}>🚪 SIGN OUT OF CODESAGA</Text>
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
    backgroundColor: 'rgba(10, 14, 23, 0.82)'
  },
  container: {
    flex: 1
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderBottomWidth: 4,
    borderBottomColor: '#1e293b'
  },
  logo: {
    width: 140,
    height: 38
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#334155'
  },
  profileBadgeText: {
    fontFamily: 'PressStart2P',
    color: '#f59e0b',
    fontSize: 9
  },
  scrollContent: {
    padding: 14
  },
  hudContainer: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 4,
    borderColor: '#1e293b',
    marginBottom: 16,
    gap: 10
  },
  hudAvatarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  hudCharName: {
    fontFamily: 'PressStart2P',
    color: '#f59e0b',
    fontSize: 8
  },
  hudXpBox: {
    gap: 4
  },
  hudXpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  hudLevelText: {
    fontFamily: 'PressStart2P',
    color: '#14b8a6',
    fontSize: 9
  },
  hudXpText: {
    fontFamily: 'PressStart2P',
    color: '#94a3b8',
    fontSize: 8
  },
  hudXpTrack: {
    height: 8,
    backgroundColor: '#0f172a',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155'
  },
  hudXpFill: {
    height: '100%',
    backgroundColor: '#14b8a6',
    borderRadius: 4
  },
  hudStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 4
  },
  hudStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  hudStatIcon: {
    fontSize: 14
  },
  hudStatCoins: {
    fontFamily: 'PressStart2P',
    color: '#f59e0b',
    fontSize: 9
  },
  hudStatStreak: {
    fontFamily: 'PressStart2P',
    color: '#f97316',
    fontSize: 9
  },
  hudStatHearts: {
    fontFamily: 'PressStart2P',
    color: '#ef4444',
    fontSize: 9
  },
  sectionHeader: {
    marginBottom: 12
  },
  sectionTitle: {
    fontFamily: 'PressStart2P',
    color: '#f8fafc',
    fontSize: 11
  },
  sectionSubtitle: {
    fontFamily: 'Outfit',
    color: '#64748b',
    fontSize: 12,
    marginTop: 2
  },
  worldsGrid: {
    gap: 12
  },
  pixelWorldPanel: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 3
  },
  worldCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  worldIcon: {
    fontSize: 24,
    marginRight: 10
  },
  worldTitleBox: {
    flex: 1
  },
  worldMetaTag: {
    fontFamily: 'PressStart2P',
    fontSize: 7,
    letterSpacing: 1,
    marginBottom: 2
  },
  worldName: {
    fontFamily: 'PressStart2P',
    color: '#f8fafc',
    fontSize: 11
  },
  worldGuideText: {
    fontFamily: 'Outfit',
    color: '#f59e0b',
    fontSize: 11,
    marginTop: 2
  },
  worldDesc: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12
  },
  worldFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 8
  },
  worldMeta: {
    fontFamily: 'Outfit',
    color: '#64748b',
    fontSize: 11
  },
  pixelButtonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6
  },
  pixelButtonBadgeText: {
    fontFamily: 'PressStart2P',
    color: '#ffffff',
    fontSize: 8
  },
  footerBox: {
    marginTop: 20,
    gap: 10
  },
  secondaryPixelButton: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155'
  },
  secondaryPixelButtonText: {
    fontFamily: 'PressStart2P',
    color: '#f8fafc',
    fontSize: 9
  },
  logoutPixelButton: {
    backgroundColor: '#451a03',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#9a3412'
  },
  logoutPixelButtonText: {
    fontFamily: 'PressStart2P',
    color: '#fca5a5',
    fontSize: 9
  }
});
