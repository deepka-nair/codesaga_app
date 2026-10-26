import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import MobileGameHUD from '../components/MobileGameHUD';
import MobilePixelPanel from '../components/MobilePixelPanel';
import MobileGameButton from '../components/MobileGameButton';
import MobileCharacterTalk from '../components/MobileCharacterTalk';
import MobileCodeEditor from '../components/MobileCodeEditor';
import ChapterModal from '../components/ChapterModal';
import mobileAudio from '../services/mobileAudio';
import { isChapterUnlocked } from '../../utils/chapterAccess';

// Shared Curriculum Data
import { SQL_CURRICULUM } from '../../data/sqlCurriculum';
import { PYTHON_CURRICULUM } from '../../data/pythonCurriculum';
import { JAVA_CURRICULUM } from '../../data/javaCurriculum';
import { FRONTEND_CURRICULUM } from '../../data/frontendCurriculum';
import { CPP_CURRICULUM } from '../../data/cppCurriculum';
import { BACKEND_CURRICULUM } from '../../data/backendCurriculum';

// Shared Client Execution Engines
import sqlEngine, { compareResultSets, INITIAL_DATABASE } from '../../services/sqlEngine';
import pythonEngine from '../../services/pythonEngine';
import javaEngine from '../../services/javaEngine';
import cppEngine from '../../services/cppEngine';
import backendEngine from '../../services/backendEngine';

const CURRICULUM_MAP = {
  sql: SQL_CURRICULUM,
  python: PYTHON_CURRICULUM,
  java: JAVA_CURRICULUM,
  frontend: FRONTEND_CURRICULUM,
  cpp: CPP_CURRICULUM,
  backend: BACKEND_CURRICULUM
};

const WORLD_CONFIGS = {
  sql: { name: 'DATABASE DETECTIVE CITY', icon: '🏙️', color: '#06b6d4', guideName: 'Detective Aria', guideRole: 'Data Sleuth', charId: 'f1' },
  python: { name: 'PYTHON VALLEY', icon: '🐍', color: '#22c55e', guideName: 'Aiden & Byte', guideRole: 'Code Explorer', charId: 'm1' },
  java: { name: 'JAVA KINGDOM', icon: '☕', color: '#f59e0b', guideName: 'Jax', guideRole: 'System Knight', charId: 'm2' },
  frontend: { name: 'WEB CREATOR CITY', icon: '🌐', color: '#0ea5e9', guideName: 'Pixel', guideRole: 'UI Architect', charId: 'f2' },
  cpp: { name: 'C++ CYBER ARENA', icon: '⚡', color: '#a855f7', guideName: 'Vector', guideRole: 'Core Operative', charId: 'f3' },
  backend: { name: 'SERVER FORTRESS', icon: '⚙️', color: '#ef4444', guideName: 'Server', guideRole: 'Tactical Detective', charId: 'm3' }
};

export default function WorldDetailScreen({
  worldId = 'sql',
  userState = {},
  onBack,
  onMissionComplete,
  onChapterComplete,
  onOpenProfile,
  onViewCertificate,
  onToggleSound,
  soundEnabled = true
}) {
  const worldConfig = WORLD_CONFIGS[worldId] || WORLD_CONFIGS.sql;
  const rawCurriculum = CURRICULUM_MAP[worldId] || SQL_CURRICULUM;
  const chapters = Array.isArray(rawCurriculum) ? rawCurriculum : (rawCurriculum?.chapters || []);

  const {
    user,
    isGuest = false,
    completedMissions = [],
    unlockedChapters = [1]
  } = userState;

  const [selectedChapterIdx, setSelectedChapterIdx] = useState(0);
  const [selectedMissionIdx, setSelectedMissionIdx] = useState(0);

  // Interactive Mission State
  const [selectedOption, setSelectedOption] = useState(null);
  const [mcFeedback, setMcFeedback] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const currentChapter = chapters[selectedChapterIdx] || chapters[0] || { id: 1, title: 'Chapter 1', missions: [] };
  const missions = currentChapter.missions || [];
  const currentMission = missions[selectedMissionIdx] || missions[0] || {};

  // Check solved status
  useEffect(() => {
    const solved = completedMissions.includes(currentMission.id);
    setIsSolved(solved);
    setSelectedOption(null);
    setMcFeedback(null);
  }, [currentMission.id, completedMissions]);

  // Handle option selection for multiple choice
  const handleSelectOption = (idx) => {
    mobileAudio.playClick();
    setSelectedOption(idx);
    setMcFeedback(null);
  };

  // Submit Multiple Choice Answer
  const handleOptionSubmit = () => {
    if (selectedOption === null) {
      Alert.alert('Selection Required', 'Please select an option first.');
      return;
    }

    const correctIdx =
      currentMission.answerIndex !== undefined
        ? currentMission.answerIndex
        : currentMission.correctPair !== undefined
        ? currentMission.correctPair
        : currentMission.correctOption;

    if (selectedOption === correctIdx) {
      mobileAudio.playSuccess();
      setMcFeedback('correct');
      setIsSolved(true);
      if (onMissionComplete) {
        onMissionComplete(currentMission.id, currentMission.xp || 50, currentMission.coins || 20);
      }

      // Check if last mission in chapter
      if (selectedMissionIdx === missions.length - 1) {
        triggerChapterCompletion();
      }
    } else {
      mobileAudio.playError();
      setMcFeedback('wrong');
      setIsSolved(false);
    }
  };

  // Code Execution Handler with Real Engines
  const handleExecuteCode = (userCode) => {
    let result = { success: false, error: 'Engine unavailable' };

    try {
      if (worldId === 'sql') {
        result = sqlEngine.execute(userCode);
        if (result.success) {
          let isCorrect = false;
          if (currentMission.expectedQuery) {
            const expectedRes = sqlEngine.execute(currentMission.expectedQuery);
            isCorrect = compareResultSets(result, expectedRes);
          } else if (currentMission.solution) {
            const expectedRes = sqlEngine.execute(currentMission.solution);
            isCorrect = compareResultSets(result, expectedRes);
          } else {
            isCorrect = true;
          }

          if (isCorrect) {
            setIsSolved(true);
            if (onMissionComplete) {
              onMissionComplete(currentMission.id, currentMission.xp || 60, currentMission.coins || 25);
            }
            if (selectedMissionIdx === missions.length - 1) {
              triggerChapterCompletion();
            }
          } else {
            result = {
              ...result,
              success: false,
              error: 'Query executed, but returned records do not match the detective case solution.'
            };
            setIsSolved(false);
          }
        }
      } else if (worldId === 'python') {
        result = pythonEngine.execute(userCode);
        if (result.success) {
          setIsSolved(true);
          if (onMissionComplete) {
            onMissionComplete(currentMission.id, currentMission.xp || 60, currentMission.coins || 25);
          }
          if (selectedMissionIdx === missions.length - 1) {
            triggerChapterCompletion();
          }
        }
      } else if (worldId === 'java') {
        result = javaEngine.execute(userCode);
        if (result.success) {
          setIsSolved(true);
          if (onMissionComplete) {
            onMissionComplete(currentMission.id, currentMission.xp || 60, currentMission.coins || 25);
          }
          if (selectedMissionIdx === missions.length - 1) {
            triggerChapterCompletion();
          }
        }
      } else if (worldId === 'cpp') {
        result = cppEngine.execute(userCode);
        if (result.success) {
          setIsSolved(true);
          if (onMissionComplete) {
            onMissionComplete(currentMission.id, currentMission.xp || 60, currentMission.coins || 25);
          }
          if (selectedMissionIdx === missions.length - 1) {
            triggerChapterCompletion();
          }
        }
      } else if (worldId === 'backend') {
        result = backendEngine.execute(userCode);
        if (result.success) {
          setIsSolved(true);
          if (onMissionComplete) {
            onMissionComplete(currentMission.id, currentMission.xp || 60, currentMission.coins || 25);
          }
          if (selectedMissionIdx === missions.length - 1) {
            triggerChapterCompletion();
          }
        }
      } else {
        // Fallback
        result = { success: true, output: ['Code executed successfully'] };
        setIsSolved(true);
      }
    } catch (err) {
      result = { success: false, error: err.message || 'Execution error' };
      setIsSolved(false);
    }

    return result;
  };

  const triggerChapterCompletion = () => {
    if (onChapterComplete) {
      const chId = currentChapter.id || selectedChapterIdx + 1;
      onChapterComplete(worldId, chId, chId + 1);
    }
    setShowCompletionModal(true);
  };

  // Chapter Navigation
  const handleSelectChapter = (chIdx) => {
    const chId = chapters[chIdx]?.id || chIdx + 1;
    const isUnlocked = isChapterUnlocked(worldId, chId, userState);

    if (!isUnlocked) {
      mobileAudio.playError();
      if (isGuest && chIdx > 0) {
        Alert.alert(
          'Guest Preview Limit',
          'Chapters 2+ are locked for Guest Sleuths. Create a free account to unlock all chapters!'
        );
      } else {
        Alert.alert(
          '🔒 CHAPTER LOCKED',
          `Complete Chapter ${chId - 1} in ${worldConfig.name} to unlock Chapter ${chId}.`
        );
      }
      return;
    }

    mobileAudio.playClick();
    setSelectedChapterIdx(chIdx);
    setSelectedMissionIdx(0);
  };

  // Previous & Next Mission
  const handlePrevMission = () => {
    if (selectedMissionIdx > 0) {
      mobileAudio.playClick();
      setSelectedMissionIdx((prev) => prev - 1);
    }
  };

  const handleNextMission = () => {
    mobileAudio.playClick();
    if (selectedMissionIdx < missions.length - 1) {
      setSelectedMissionIdx((prev) => prev + 1);
    } else if (selectedChapterIdx < chapters.length - 1) {
      triggerChapterCompletion();
    } else {
      triggerChapterCompletion();
    }
  };

  const isCodeMission = ['write_query', 'fix_query', 'detective_boss', 'code_challenge', 'modify_code'].includes(currentMission.type);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backText}>← WORLDS</Text>
        </TouchableOpacity>

        <View style={styles.worldHeaderInfo}>
          <Text style={[styles.worldHeaderText, { color: worldConfig.color }]}>
            {worldConfig.icon} {worldConfig.name}
          </Text>
        </View>
      </View>

      {/* Game HUD */}
      <MobileGameHUD
        userState={userState}
        onOpenProfile={onOpenProfile}
        onToggleSound={onToggleSound}
        soundEnabled={soundEnabled}
      />

      {/* Chapter Selection Horizontal Carousel Bar */}
      <View style={styles.chapterCarouselContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chapterCarousel}>
          {chapters.map((ch, idx) => {
            const chId = ch.id || idx + 1;
            const isSelected = selectedChapterIdx === idx;
            const isUnlocked = isChapterUnlocked(worldId, chId, userState);
            const targetWProg = userState.worldProgress?.[`${worldId}Progress`];
            const isCompleted = (targetWProg?.completedChapters || []).includes(chId)
              || (worldId === 'sql' && (userState.completedChapters || []).includes(chId));

            return (
              <TouchableOpacity
                key={ch.id || idx}
                style={[
                  styles.chapterTab,
                  isSelected && { backgroundColor: worldConfig.color, borderColor: '#ffffff' },
                  !isUnlocked && styles.chapterTabLocked
                ]}
                onPress={() => handleSelectChapter(idx)}
                activeOpacity={isUnlocked ? 0.7 : 0.9}
              >
                <Text style={styles.chapterTabIcon}>{isCompleted ? '⭐' : isUnlocked ? '📁' : '🔒'}</Text>
                <Text style={[styles.chapterTabText, isSelected && { color: '#0a0e17' }, !isUnlocked && { color: '#64748b' }]}>
                  CH {ch.id || idx + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Mission Body Scroll Container */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mission Header Card */}
        <MobilePixelPanel borderTopColor={worldConfig.color} style={styles.missionCard}>
          {/* Mission Meta Header */}
          <View style={styles.missionMetaRow}>
            <Text style={styles.missionIdTag}>
              CASE #{currentChapter.id || selectedChapterIdx + 1}0{selectedMissionIdx + 1} • {(currentMission.type || 'MISSION').toUpperCase()}
            </Text>
            <View style={styles.missionProgressBadge}>
              <Text style={styles.missionCounter}>
                {selectedMissionIdx + 1} / {missions.length}
              </Text>
              {isSolved && (
                <Text style={styles.solvedBadge}>✓ SOLVED</Text>
              )}
            </View>
          </View>

          {/* Mission Title */}
          <Text style={styles.missionTitle}>
            {currentMission.title || `Mission ${selectedMissionIdx + 1}`}
          </Text>

          {/* Character Talk Story Bubble */}
          <MobileCharacterTalk
            characterId={worldConfig.charId}
            speakerName={worldConfig.guideName}
            speakerRole={worldConfig.guideRole}
            dialogText={currentMission.story || 'Examine the clues and solve the mission.'}
            style={{ marginVertical: 10 }}
          />

          {/* Educational Concept Card (WHAT, WHY, WHEN, HOW) */}
          {currentMission.conceptExplanation && (
            <View style={styles.conceptCard}>
              <Text style={[styles.conceptTitle, { color: worldConfig.color }]}>
                📖 BRIEFING & CLUES
              </Text>
              {currentMission.conceptExplanation.what && (
                <Text style={styles.conceptLine}>
                  <Text style={styles.conceptLabel}>WHAT: </Text>
                  {currentMission.conceptExplanation.what}
                </Text>
              )}
              {currentMission.conceptExplanation.why && (
                <Text style={styles.conceptLine}>
                  <Text style={styles.conceptLabel}>WHY: </Text>
                  {currentMission.conceptExplanation.why}
                </Text>
              )}
              {currentMission.conceptExplanation.how && (
                <Text style={styles.conceptLine}>
                  <Text style={styles.conceptLabel}>HOW: </Text>
                  <Text style={{ fontFamily: 'monospace', color: '#38bdf8' }}>
                    {currentMission.conceptExplanation.how}
                  </Text>
                </Text>
              )}
            </View>
          )}

          {/* Interactive Mission Input */}
          {isCodeMission ? (
            <MobileCodeEditor
              key={currentMission.id}
              initialCode={currentMission.template || currentMission.buggyQuery || currentMission.buggyCode || ''}
              language={worldId}
              onExecute={handleExecuteCode}
              hintList={currentMission.hints || []}
              schema={worldId === 'sql' ? INITIAL_DATABASE : null}
            />
          ) : (
            <View style={styles.mcContainer}>
              {/* Options List */}
              {Array.isArray(currentMission.options) && currentMission.options.map((opt, idx) => {
                const optText = typeof opt === 'string' ? opt : (opt?.text || String(opt));
                const isSelected = selectedOption === idx;
                const isCorrect = mcFeedback === 'correct' && isSelected;
                const isWrong = mcFeedback === 'wrong' && isSelected;

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.mcOptionButton,
                      isSelected && { borderColor: worldConfig.color, backgroundColor: 'rgba(6, 182, 212, 0.15)' },
                      isCorrect && { borderColor: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.2)' },
                      isWrong && { borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.2)' }
                    ]}
                    onPress={() => handleSelectOption(idx)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.mcOptionLetter}>
                      {String.fromCharCode(65 + idx)}.
                    </Text>
                    <Text style={styles.mcOptionText}>
                      {optText}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Submit Answer Button */}
              <MobileGameButton
                variant="gold"
                size="medium"
                onPress={handleOptionSubmit}
                disabled={selectedOption === null || isSolved}
                style={{ marginTop: 8 }}
              >
                SUBMIT ANSWER 🚀
              </MobileGameButton>

              {/* Feedback Alert */}
              {mcFeedback && (
                <View
                  style={[
                    styles.feedbackBanner,
                    mcFeedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong
                  ]}
                >
                  <Text style={[styles.feedbackText, { color: mcFeedback === 'correct' ? '#22c55e' : '#ef4444' }]}>
                    {mcFeedback === 'correct'
                      ? '✓ CORRECT! Critical evidence verified.'
                      : '❌ INCORRECT. Review the clue and try again.'}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Solved Banner */}
          {isSolved && !mcFeedback && (
            <View style={styles.solvedNotice}>
              <Text style={styles.solvedNoticeText}>✓ MISSION SOLVED! Case file complete.</Text>
            </View>
          )}

          {/* Navigation Controls: Prev & Next */}
          <View style={styles.navRow}>
            <MobileGameButton
              variant="secondary"
              size="medium"
              onPress={handlePrevMission}
              disabled={selectedMissionIdx === 0}
              style={{ flex: 1 }}
            >
              ← PREV
            </MobileGameButton>

            <MobileGameButton
              variant={isSolved ? 'gold' : 'secondary'}
              size="medium"
              onPress={handleNextMission}
              disabled={!isSolved}
              style={{ flex: 1 }}
            >
              {selectedMissionIdx === missions.length - 1 ? 'FINISH CH 🏆' : 'NEXT →'}
            </MobileGameButton>
          </View>
        </MobilePixelPanel>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Chapter Completion Modal */}
      <ChapterModal
        visible={showCompletionModal}
        chapter={currentChapter}
        xpEarned={300}
        coinsEarned={150}
        stars={3}
        onContinue={() => {
          setShowCompletionModal(false);
          if (selectedChapterIdx < chapters.length - 1) {
            setSelectedChapterIdx((prev) => prev + 1);
            setSelectedMissionIdx(0);
          } else {
            onBack();
          }
        }}
        onViewCertificate={onViewCertificate}
        isWorldComplete={selectedChapterIdx === chapters.length - 1}
        worldName={worldConfig.name}
        userState={userState}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e17'
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8
  },
  backButton: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  backText: {
    fontFamily: 'PressStart2P',
    fontSize: 7.5,
    color: '#f59e0b'
  },
  worldHeaderInfo: {
    flex: 1
  },
  worldHeaderText: {
    fontFamily: 'PressStart2P',
    fontSize: 8.5
  },
  chapterCarouselContainer: {
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingVertical: 6
  },
  chapterCarousel: {
    gap: 6,
    paddingHorizontal: 10
  },
  chapterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1e293b',
    borderWidth: 1.5,
    borderColor: '#334155',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  chapterTabLocked: {
    opacity: 0.5
  },
  chapterTabIcon: {
    fontSize: 10
  },
  chapterTabText: {
    fontFamily: 'PressStart2P',
    fontSize: 7,
    color: '#f8fafc'
  },
  scrollContainer: {
    flex: 1
  },
  scrollContent: {
    padding: 10
  },
  missionCard: {
    gap: 8
  },
  missionMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  missionIdTag: {
    fontFamily: 'PressStart2P',
    fontSize: 7.5,
    color: '#f59e0b'
  },
  missionProgressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  missionCounter: {
    fontFamily: 'PressStart2P',
    fontSize: 7,
    color: '#94a3b8'
  },
  solvedBadge: {
    fontFamily: 'PressStart2P',
    fontSize: 7,
    color: '#14b8a6'
  },
  missionTitle: {
    fontFamily: 'Outfit',
    fontWeight: '700',
    fontSize: 15,
    color: '#ffffff',
    marginTop: 2
  },
  conceptCard: {
    backgroundColor: '#0e2526',
    borderWidth: 1,
    borderColor: '#2a5a5c',
    borderRadius: 8,
    padding: 8,
    gap: 4
  },
  conceptTitle: {
    fontFamily: 'PressStart2P',
    fontSize: 7.5,
    marginBottom: 2
  },
  conceptLine: {
    fontFamily: 'Outfit',
    fontSize: 11,
    color: '#f8fafc',
    lineHeight: 15
  },
  conceptLabel: {
    fontFamily: 'Outfit',
    fontWeight: '700',
    color: '#f59e0b'
  },
  mcContainer: {
    gap: 8,
    marginTop: 4
  },
  mcOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0e2526',
    borderWidth: 1.5,
    borderColor: '#2a5a5c',
    borderRadius: 8,
    padding: 10,
    gap: 8
  },
  mcOptionLetter: {
    fontFamily: 'PressStart2P',
    fontSize: 9,
    color: '#f59e0b'
  },
  mcOptionText: {
    fontFamily: 'Outfit',
    fontSize: 12,
    color: '#f8fafc',
    flex: 1,
    lineHeight: 16
  },
  feedbackBanner: {
    borderWidth: 1.5,
    borderRadius: 6,
    padding: 8,
    alignItems: 'center'
  },
  feedbackCorrect: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22c55e'
  },
  feedbackWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444'
  },
  feedbackText: {
    fontFamily: 'PressStart2P',
    fontSize: 7.5,
    textAlign: 'center'
  },
  solvedNotice: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1.5,
    borderColor: '#22c55e',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
    marginTop: 6
  },
  solvedNoticeText: {
    fontFamily: 'PressStart2P',
    fontSize: 7.5,
    color: '#22c55e'
  },
  navRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b'
  }
});
