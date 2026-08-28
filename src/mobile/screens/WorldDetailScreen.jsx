import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SQL_CURRICULUM } from '../../data/sqlCurriculum';
import { PYTHON_CURRICULUM } from '../../data/pythonCurriculum';
import { JAVA_CURRICULUM } from '../../data/javaCurriculum';
import { FRONTEND_CURRICULUM } from '../../data/frontendCurriculum';
import { CPP_CURRICULUM } from '../../data/cppCurriculum';
import { BACKEND_CURRICULUM } from '../../data/backendCurriculum';
import PixelCharacterAvatar from '../components/PixelCharacterAvatar';

const CURRICULUM_MAP = {
  sql: { title: 'SQL WORLD', color: '#3b82f6', guide: 'Detective Aria Silver', charId: 'f1', data: SQL_CURRICULUM },
  python: { title: 'PYTHON WORLD', color: '#eab308', guide: 'Sleuth Bram', charId: 'm2', data: PYTHON_CURRICULUM },
  java: { title: 'JAVA WORLD', color: '#ef4444', guide: 'Architect Cyrus', charId: 'm3', data: JAVA_CURRICULUM },
  frontend: { title: 'FRONTEND WORLD', color: '#ec4899', guide: 'Inspector Finn', charId: 'm6', data: FRONTEND_CURRICULUM },
  cpp: { title: 'C++ WORLD', color: '#a855f7', guide: 'Detective Elara', charId: 'f4', data: CPP_CURRICULUM },
  backend: { title: 'BACKEND WORLD', color: '#10b981', guide: 'Specialist Dax', charId: 'm4', data: BACKEND_CURRICULUM }
};

export default function WorldDetailScreen({ worldId, userState, onBack, onMissionComplete }) {
  const worldConfig = CURRICULUM_MAP[worldId] || CURRICULUM_MAP.sql;
  const chapters = worldConfig.data || [];
  const completedMissions = userState.completedMissions || [];

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeMissionIndex, setActiveMissionIndex] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null); // { success: boolean, message: string }
  const [isPassed, setIsPassed] = useState(false);

  const currentChapter = chapters[activeChapterIndex] || chapters[0];
  const missionsList = currentChapter?.missions || [];
  const activeMission = activeMissionIndex !== null ? missionsList[activeMissionIndex] : null;

  const handleSelectMission = (mission, idx) => {
    setActiveMissionIndex(idx);
    setSelectedOption(null);
    setFeedback(null);
    setIsPassed(completedMissions.includes(mission.id));
  };

  const handleCheckAnswer = () => {
    if (!activeMission || selectedOption === null) {
      Alert.alert('SELECT AN ANSWER', 'Please choose an option before checking.');
      return;
    }

    const isCorrect = selectedOption === activeMission.answerIndex || selectedOption === activeMission.correctPair;

    if (isCorrect) {
      setIsPassed(true);
      setFeedback({
        success: true,
        message: `🎉 CASE EVIDENCE VERIFIED! +${activeMission.xp || 50} XP • +${activeMission.coins || 20} COINS`
      });

      onMissionComplete(activeMission.id, activeMission.xp || 50, activeMission.coins || 20);
    } else {
      setIsPassed(false);
      setFeedback({
        success: false,
        message: '❌ INCORRECT QUERY EVIDENCE. REVIEW DETECTIVE NOTES AND RETRY.'
      });
    }
  };

  // Next Mission Flow Logic matching Web
  const handleNextMission = () => {
    if (activeMissionIndex === null) return;

    if (activeMissionIndex < missionsList.length - 1) {
      // Advance to next mission in current chapter
      const nextIdx = activeMissionIndex + 1;
      setActiveMissionIndex(nextIdx);
      setSelectedOption(null);
      setFeedback(null);
      setIsPassed(completedMissions.includes(missionsList[nextIdx].id));
    } else if (activeChapterIndex < chapters.length - 1) {
      // Advance to first mission in next chapter
      const nextChapterIdx = activeChapterIndex + 1;
      setActiveChapterIndex(nextChapterIdx);
      setActiveMissionIndex(0);
      setSelectedOption(null);
      setFeedback(null);
      const nextMissions = chapters[nextChapterIdx]?.missions || [];
      setIsPassed(completedMissions.includes(nextMissions[0]?.id));
    } else {
      Alert.alert('🏆 WORLD COMPLETED!', `Congratulations! You have completed all missions in ${worldConfig.title}.`);
      setActiveMissionIndex(null);
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
            <View style={styles.headerTitleBox}>
              <Text style={[styles.headerTitle, { color: worldConfig.color }]}>
                {worldConfig.title}
              </Text>
              <Text style={styles.headerGuideText}>Guide: {worldConfig.guide}</Text>
            </View>
            <PixelCharacterAvatar characterId={worldConfig.charId} size={28} borderColor={worldConfig.color} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Chapter Tabs Bar */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chapterBar}>
              {chapters.map((ch, idx) => {
                const isActive = idx === activeChapterIndex;
                return (
                  <TouchableOpacity
                    key={ch.id || idx}
                    style={[
                      styles.chapterTab,
                      isActive && { backgroundColor: worldConfig.color, borderColor: worldConfig.color }
                    ]}
                    onPress={() => {
                      setActiveChapterIndex(idx);
                      setActiveMissionIndex(null);
                      setFeedback(null);
                      setIsPassed(false);
                    }}
                  >
                    <Text style={[styles.chapterTabText, isActive && styles.activeChapterTabText]}>
                      CH {ch.id}: {ch.title.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Chapter Header Card */}
            {Boolean(currentChapter) && (
              <View style={styles.pixelChapterCard}>
                <Text style={styles.chapterSubtitle}>{currentChapter.subtitle?.toUpperCase()}</Text>
                <Text style={styles.chapterTitle}>{currentChapter.title}</Text>
                <Text style={styles.chapterDesc}>{currentChapter.description}</Text>
              </View>
            )}

            {/* Active Mission Runner OR Missions List */}
            {activeMission ? (
              <View style={styles.pixelMissionPanel}>
                <View style={styles.missionHeaderRow}>
                  <Text style={styles.missionTitle}>{activeMission.title}</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setActiveMissionIndex(null)}>
                    <Text style={styles.closeButtonText}>✕ CLOSE</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.missionStory}>{activeMission.story}</Text>

                {Boolean(activeMission.conceptExplanation) && (
                  <View style={styles.conceptBox}>
                    <Text style={styles.conceptTitle}>💡 DETECTIVE CASE FILE NOTE ({worldConfig.guide})</Text>
                    <Text style={styles.conceptText}>{activeMission.conceptExplanation.what}</Text>
                  </View>
                )}

                {/* Options List */}
                <View style={styles.optionsList}>
                  {(activeMission.options || []).map((opt, oIdx) => {
                    const isStringOpt = typeof opt === 'string';
                    const optText = isStringOpt ? opt : opt.text || opt.label;
                    const isSelected = selectedOption === oIdx;

                    return (
                      <TouchableOpacity
                        key={oIdx}
                        style={[
                          styles.pixelOptionCard,
                          isSelected && { borderColor: worldConfig.color, backgroundColor: '#1e293b' }
                        ]}
                        onPress={() => setSelectedOption(oIdx)}
                      >
                        <Text style={[styles.optionText, isSelected && { color: '#ffffff', fontWeight: '700' }]}>
                          {optText}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Feedback Banner */}
                {Boolean(feedback) && (
                  <View
                    style={[
                      styles.feedbackBanner,
                      feedback.success ? styles.successBanner : styles.errorBanner
                    ]}
                  >
                    <Text style={feedback.success ? styles.successText : styles.errorText}>
                      {feedback.message}
                    </Text>
                  </View>
                )}

                {/* Verification & NEXT MISSION Actions */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.pixelButton, { backgroundColor: worldConfig.color, flex: 1 }]}
                    onPress={handleCheckAnswer}
                  >
                    <Text style={styles.pixelButtonText}>
                      {isPassed ? 'RE-VERIFY ANSWER' : 'VERIFY EVIDENCE →'}
                    </Text>
                  </TouchableOpacity>

                  {isPassed && (
                    <TouchableOpacity
                      style={[styles.pixelButton, styles.nextMissionButton]}
                      onPress={handleNextMission}
                    >
                      <Text style={styles.nextMissionButtonText}>NEXT MISSION →</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.missionsList}>
                <Text style={styles.sectionHeaderTitle}>CHAPTER CASE FILES ({missionsList.length} MISSIONS)</Text>
                {missionsList.map((m, mIdx) => {
                  const isCompleted = completedMissions.includes(m.id);
                  return (
                    <TouchableOpacity
                      key={m.id || mIdx}
                      style={[styles.pixelMissionItem, isCompleted && styles.completedMissionItem]}
                      onPress={() => handleSelectMission(m, mIdx)}
                    >
                      <View style={styles.missionItemHeader}>
                        <Text style={styles.missionItemIcon}>{isCompleted ? '✅' : '📜'}</Text>
                        <View style={styles.missionItemTitleBox}>
                          <Text style={styles.missionItemTitle}>{m.title}</Text>
                          <Text style={styles.missionItemReward}>
                            +{m.xp || 50} XP • +{m.coins || 20} COINS
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.missionPlayText}>INVESTIGATE →</Text>
                    </TouchableOpacity>
                  );
                })}
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
  headerTitleBox: {
    alignItems: 'center'
  },
  headerTitle: {
    fontFamily: 'PressStart2P',
    fontSize: 10
  },
  headerGuideText: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2
  },
  scrollContent: {
    padding: 14
  },
  chapterBar: {
    flexDirection: 'row',
    marginBottom: 14
  },
  chapterTab: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderWidth: 2,
    borderColor: '#334155',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6
  },
  chapterTabText: {
    fontFamily: 'PressStart2P',
    color: '#94a3b8',
    fontSize: 8
  },
  activeChapterTabText: {
    color: '#ffffff'
  },
  pixelChapterCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 4,
    borderColor: '#1e293b',
    marginBottom: 14
  },
  chapterSubtitle: {
    fontFamily: 'PressStart2P',
    color: '#14b8a6',
    fontSize: 8,
    marginBottom: 4
  },
  chapterTitle: {
    fontFamily: 'Outfit-Bold',
    color: '#f8fafc',
    fontSize: 18,
    marginBottom: 4
  },
  chapterDesc: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 16
  },
  sectionHeaderTitle: {
    fontFamily: 'PressStart2P',
    color: '#f8fafc',
    fontSize: 10,
    marginBottom: 10
  },
  missionsList: {
    gap: 10
  },
  pixelMissionItem: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 3,
    borderColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  completedMissionItem: {
    borderColor: '#166534',
    backgroundColor: 'rgba(5, 46, 22, 0.95)'
  },
  missionItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  missionItemIcon: {
    fontSize: 18,
    marginRight: 8
  },
  missionItemTitleBox: {
    flex: 1
  },
  missionItemTitle: {
    fontFamily: 'Outfit-Bold',
    color: '#f8fafc',
    fontSize: 13
  },
  missionItemReward: {
    fontFamily: 'PressStart2P',
    color: '#f59e0b',
    fontSize: 7,
    marginTop: 2
  },
  missionPlayText: {
    fontFamily: 'PressStart2P',
    color: '#14b8a6',
    fontSize: 8,
    marginLeft: 6
  },
  pixelMissionPanel: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 4,
    borderColor: '#334155'
  },
  missionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  missionTitle: {
    fontFamily: 'Outfit-Bold',
    color: '#f8fafc',
    fontSize: 16,
    flex: 1
  },
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#1e293b',
    borderRadius: 4
  },
  closeButtonText: {
    fontFamily: 'PressStart2P',
    color: '#94a3b8',
    fontSize: 7
  },
  missionStory: {
    fontFamily: 'Outfit',
    color: '#e2e8f0',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12
  },
  conceptBox: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14
  },
  conceptTitle: {
    fontFamily: 'PressStart2P',
    color: '#f59e0b',
    fontSize: 8,
    marginBottom: 4
  },
  conceptText: {
    fontFamily: 'Outfit',
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 16
  },
  optionsList: {
    gap: 8,
    marginBottom: 14
  },
  pixelOptionCard: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderWidth: 2,
    borderRadius: 8,
    padding: 12
  },
  optionText: {
    fontFamily: 'Outfit',
    color: '#cbd5e1',
    fontSize: 13
  },
  feedbackBanner: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 12
  },
  successBanner: {
    backgroundColor: '#052e16',
    borderColor: '#166534',
    borderWidth: 2
  },
  errorBanner: {
    backgroundColor: '#451a03',
    borderColor: '#9a3412',
    borderWidth: 2
  },
  successText: {
    fontFamily: 'PressStart2P',
    color: '#4ade80',
    fontSize: 8,
    textAlign: 'center'
  },
  errorText: {
    fontFamily: 'PressStart2P',
    color: '#fca5a5',
    fontSize: 8,
    textAlign: 'center'
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4
  },
  pixelButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  pixelButtonText: {
    fontFamily: 'PressStart2P',
    color: '#ffffff',
    fontSize: 9
  },
  nextMissionButton: {
    backgroundColor: '#166534',
    borderWidth: 2,
    borderColor: '#22c55e',
    flex: 1
  },
  nextMissionButtonText: {
    fontFamily: 'PressStart2P',
    color: '#ffffff',
    fontSize: 9
  }
});
