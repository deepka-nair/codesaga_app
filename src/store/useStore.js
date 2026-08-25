import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  normalizeEmail, 
  registerAccount, 
  setLastActiveEmail, 
  loadLocalAccountProgress, 
  saveAccountProgress
} from '../services/accountService';
import { 
  debouncedSaveProgress, 
  flushPendingProgressSave 
} from '../services/userDatabase';

const useStore = create(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      isGuest: false,
      syncError: null,
      setSyncError: (msg) => set({ syncError: msg }),

      
      // Audio Settings State
      isMuted: false,
      sfxVolume: 0.8,
      bgmVolume: 0.5,

      // Progression State
      xp: 150,
      level: 1,
      coins: 70,
      hearts: 5,
      streak: 1,
      longestStreak: 3,

      // Weekly Activity Tracker (Mon-Sun)
      weeklyActivity: [true, true, true, true, true, false, false],
      dailyGoalMinutes: 20,
      todayActivityMinutes: 14,
      
      // Onboarding State
      onboardingComplete: false,
      experienceLevel: '',
      learningGoal: '',
      character: 'm1',

      // SQL & Python Progression Trackers
      unlockedChapters: [1],
      completedChapters: [],
      completedMissions: [],
      chapterStars: {},

      // Independent Per-Language Resume Progression
      sqlProgress: {
        currentChapter: 1,
        currentMissionIndex: 0,
        completedChapters: [],
        completedMissions: []
      },
      pythonProgress: {
        currentChapter: 1,
        currentMissionIndex: 0,
        completedChapters: [],
        completedMissions: []
      },
      javaProgress: {
        currentChapter: 1,
        currentMissionIndex: 0,
        completedChapters: [],
        completedMissions: []
      },
      frontendProgress: {
        currentChapter: 1,
        currentMissionIndex: 0,
        completedChapters: [],
        completedMissions: []
      },
      cppProgress: {
        currentChapter: 1,
        currentMissionIndex: 0,
        completedChapters: [],
        completedMissions: []
      },
      backendProgress: {
        currentChapter: 1,
        currentMissionIndex: 0,
        completedChapters: [],
        completedMissions: []
      },





      // Career, Certificate & Achievements State
      certificateName: '',
      certificateIssued: false,
      certificateId: '',
      certificateIssuedAt: '',
      worldCertificates: {},
      githubConnected: false,
      githubProfile: null,
      githubStatus: 'NOT_CONNECTED',
      githubError: null,

      linkedinConnected: false,
      linkedinProfile: null,
      linkedinStatus: 'NOT_CONNECTED',
      linkedinError: null,

      earnedAchievements: [],
      unlockedCertificates: [],
      newUnlockedAchievement: null,

      // World Certificate Issuance Action
      claimWorldCertificate: async (worldId = 'sql') => {
        const state = get();
        if (!state.user || state.isGuest) return null;

        const currentCertificates = state.worldCertificates || {};
        if (currentCertificates[worldId]) {
          return currentCertificates[worldId];
        }

        const worldPrefixMap = { sql: 'W1', python: 'W2', java: 'W3', frontend: 'W4', cpp: 'W5', backend: 'W6' };
        const wPrefix = worldPrefixMap[worldId] || 'W1';
        const year = new Date().getFullYear();
        const randHex = Math.random().toString(36).substring(2, 8).toUpperCase();
        const certId = `CS-${wPrefix}-${randHex}`;
        const certIssuedAt = new Date().toISOString();

        const newCertObj = {
          id: certId,
          issued_at: certIssuedAt,
          world_id: worldId
        };

        const updatedCertificates = {
          ...currentCertificates,
          [worldId]: newCertObj
        };

        const newState = {
          worldCertificates: updatedCertificates
        };

        set(newState);

        const emailKey = normalizeEmail(state.user.email);
        debouncedSaveProgress(emailKey, { ...state, ...newState });

        return newCertObj;
      },

      // Certificate Issuance Action
      claimCertificate: async () => {
        const state = get();
        if (!state.user || state.isGuest) return null;

        let certId = state.certificateId;
        let certIssuedAt = state.certificateIssuedAt;

        if (!certId) {
          const year = new Date().getFullYear();
          const randHex = Math.random().toString(36).substring(2, 8).toUpperCase();
          certId = `CS-${year}-${randHex}`;
        }

        if (!certIssuedAt) {
          certIssuedAt = new Date().toISOString();
        }

        const newState = {
          certificateIssued: true,
          certificateId: certId,
          certificateIssuedAt: certIssuedAt
        };

        set(newState);

        const emailKey = normalizeEmail(state.user.email);
        debouncedSaveProgress(emailKey, { ...state, ...newState });

        return {
          certificateId: certId,
          certificateIssuedAt: certIssuedAt,
          certificateIssued: true,
          username: state.user.name || state.certificateName
        };
      },

      // Inactivity & Activity Tracking
      lastActiveTimestamp: Date.now(),
      updateLastActiveTimestamp: (ts) => set({ lastActiveTimestamp: ts || Date.now() }),

      // Audio Actions
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      setSfxVolume: (val) => set({ sfxVolume: val }),
      setBgmVolume: (val) => set({ bgmVolume: val }),

      // GitHub Real Integration Actions
      setGithubStatus: (status, error = null) => set({ githubStatus: status, githubError: error }),
      setGithubProfile: (profile) => set({ 
        githubProfile: profile, 
        githubConnected: !!profile, 
        githubStatus: profile ? 'CONNECTED' : 'NOT_CONNECTED', 
        githubError: null 
      }),
      disconnectGithub: () => set({ 
        githubProfile: null, 
        githubConnected: false, 
        githubStatus: 'NOT_CONNECTED', 
        githubError: null 
      }),

      // LinkedIn Real Integration Actions
      setLinkedinStatus: (status, error = null) => set({ linkedinStatus: status, linkedinError: error }),
      setLinkedinProfile: (profile) => set({ 
        linkedinProfile: profile, 
        linkedinConnected: !!profile, 
        linkedinStatus: profile ? 'CONNECTED' : 'NOT_CONNECTED', 
        linkedinError: null 
      }),
      disconnectLinkedin: () => set({ 
        linkedinProfile: null, 
        linkedinConnected: false, 
        linkedinStatus: 'NOT_CONNECTED', 
        linkedinError: null 
      }),


      // Certificate Action
      updateCertificateName: (name) => set({ certificateName: name }),

      // Language Progress Actions
      updateSqlProgress: (chapterId, missionIndex) => set((state) => {
        const sqlProgress = {
          ...(state.sqlProgress || {}),
          currentChapter: Number(chapterId) || 1,
          currentMissionIndex: Number(missionIndex) || 0
        };
        const newState = { sqlProgress };
        if (state.user && !state.isGuest) {
          debouncedSaveProgress(state.user.email, { ...state, ...newState });
        }
        return newState;
      }),

      updatePythonProgress: (chapterId, missionIndex) => set((state) => {
        const pythonProgress = {
          ...(state.pythonProgress || {}),
          currentChapter: Number(chapterId) || 1,
          currentMissionIndex: Number(missionIndex) || 0
        };
        const newState = { pythonProgress };
        if (state.user && !state.isGuest) {
          debouncedSaveProgress(state.user.email, { ...state, ...newState });
        }
        return newState;
      }),

      updateJavaProgress: (chapterId, missionIndex) => set((state) => {
        const javaProgress = {
          ...(state.javaProgress || {}),
          currentChapter: Number(chapterId) || 1,
          currentMissionIndex: Number(missionIndex) || 0
        };
        const newState = { javaProgress };
        if (state.user && !state.isGuest) {
          debouncedSaveProgress(state.user.email, { ...state, ...newState });
        }
        return newState;
      }),

      updateFrontendProgress: (chapterId, missionIndex) => set((state) => {
        const frontendProgress = {
          ...(state.frontendProgress || {}),
          currentChapter: Number(chapterId) || 1,
          currentMissionIndex: Number(missionIndex) || 0
        };
        const newState = { frontendProgress };
        if (state.user && !state.isGuest) {
          debouncedSaveProgress(state.user.email, { ...state, ...newState });
        }
        return newState;
      }),

      updateCppProgress: (chapterId, missionIndex) => set((state) => {
        const cppProgress = {
          ...(state.cppProgress || {}),
          currentChapter: Number(chapterId) || 1,
          currentMissionIndex: Number(missionIndex) || 0
        };
        const newState = { cppProgress };
        if (state.user && !state.isGuest) {
          debouncedSaveProgress(state.user.email, { ...state, ...newState });
        }
        return newState;
      }),

      updateBackendProgress: (chapterId, missionIndex) => set((state) => {
        const backendProgress = {
          ...(state.backendProgress || {}),
          currentChapter: Number(chapterId) || 1,
          currentMissionIndex: Number(missionIndex) || 0
        };
        const newState = { backendProgress };
        if (state.user && !state.isGuest) {
          debouncedSaveProgress(state.user.email, { ...state, ...newState });
        }
        return newState;
      }),






      // Auth Actions
      login: (userData, cloudProgress = null) => {
        const emailKey = normalizeEmail(userData.email || userData.id || userData.uid);
        registerAccount(emailKey);
        setLastActiveEmail(emailKey);

        const localState = loadLocalAccountProgress(emailKey) || {};
        const isDev = emailKey === 'deepkav5008.sse@saveetha.com' || cloudProgress?.role === 'developer' || userData?.role === 'developer';
        const roleVal = isDev ? 'developer' : (cloudProgress?.role || userData?.role || 'user');

        const userObj = {
          ...userData,
          email: emailKey,
          id: userData.id || 'usr_' + btoa(emailKey).replace(/=/g, ''),
          name: userData.name || userData.username || (isDev ? 'Developer' : emailKey.split('@')[0]),
          role: roleVal
        };

        const mergedProgress = {
          ...localState,
          ...(cloudProgress || {})
        };

        set({
          user: userObj,
          isGuest: false,
          syncError: null,
          onboardingComplete: mergedProgress.onboardingComplete ?? true,
          xp: mergedProgress.xp ?? 0,
          level: mergedProgress.level ?? 1,
          coins: mergedProgress.coins ?? 70,
          hearts: mergedProgress.hearts ?? 5,
          streak: mergedProgress.streak ?? 0,
          longestStreak: mergedProgress.longestStreak ?? 0,
          completedMissions: Array.isArray(mergedProgress.completedMissions) ? mergedProgress.completedMissions : (Array.isArray(mergedProgress.completedQuests) ? mergedProgress.completedQuests : []),
          completedChapters: Array.isArray(mergedProgress.completedChapters) ? mergedProgress.completedChapters : [],
          unlockedChapters: mergedProgress.unlockedChapters ?? [1],
          chapterStars: mergedProgress.chapterStars ?? {},
          earnedAchievements: Array.isArray(mergedProgress.earnedAchievements) ? mergedProgress.earnedAchievements : (Array.isArray(mergedProgress.achievements) ? mergedProgress.achievements : []),
          character: mergedProgress.character ?? 'm1',
          certificateName: cloudProgress?.username || mergedProgress.username || mergedProgress.certificateName || userObj.name,
          certificateIssued: Boolean(mergedProgress.certificate_issued || mergedProgress.certificateIssued),
          certificateId: mergedProgress.certificate_id || mergedProgress.certificateId || '',
          certificateIssuedAt: mergedProgress.certificate_issued_at || mergedProgress.certificateIssuedAt || '',
          worldCertificates: mergedProgress.world_certificates || mergedProgress.worldCertificates || {},
          sqlProgress: mergedProgress.sqlProgress ?? { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
          pythonProgress: mergedProgress.pythonProgress ?? { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
          javaProgress: mergedProgress.javaProgress ?? { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
          frontendProgress: mergedProgress.frontendProgress ?? { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
          cppProgress: mergedProgress.cppProgress ?? { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
          backendProgress: mergedProgress.backendProgress ?? { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] }
        });

        // Persist local cache snapshot
        saveAccountProgress(emailKey, mergedProgress);
      },

      
      loginGuest: () => {
        const guestId = `guest_${Date.now()}`;
        try {
          localStorage.removeItem("codesaga_session");
        } catch (e) {}

        set({
          isGuest: true,
          user: { name: 'Guest Sleuth', email: null, id: guestId, uid: guestId, role: 'guest' },
          syncError: null,
          onboardingComplete: true,
          githubConnected: false,
          githubProfile: null,
          githubStatus: 'NOT_CONNECTED',
          githubError: null,
          xp: 0,
          level: 1,
          coins: 0,
          streak: 0,
          completedMissions: [],
          completedChapters: [],
          unlockedChapters: [1],
          chapterStars: {},
          earnedAchievements: [],
          sqlProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
          pythonProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
          javaProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
          frontendProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
          cppProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] },
          backendProgress: { currentChapter: 1, currentMissionIndex: 0, completedChapters: [], completedMissions: [] }
        });
      },

      
      logout: () => {
        const state = get();
        if (state.user && !state.isGuest) {
          const emailKey = normalizeEmail(state.user.email);
          const snapshot = {
            xp: state.xp,
            level: state.level,
            coins: state.coins,
            streak: state.streak,
            longestStreak: state.longestStreak,
            onboardingComplete: state.onboardingComplete,
            character: state.character,
            completedMissions: state.completedMissions,
            completedChapters: state.completedChapters,
            unlockedChapters: state.unlockedChapters,
            chapterStars: state.chapterStars,
            earnedAchievements: state.earnedAchievements,
            sqlProgress: state.sqlProgress,
            pythonProgress: state.pythonProgress,
            javaProgress: state.javaProgress,
            frontendProgress: state.frontendProgress,
            cppProgress: state.cppProgress,
            backendProgress: state.backendProgress
          };

          // Save local snapshot & flush pending debounced save to Google Sheets immediately
          saveAccountProgress(emailKey, snapshot);
          flushPendingProgressSave();
        }

        try {
          localStorage.removeItem("codesaga_session");
        } catch (e) {}

        set({ 
          user: null, 
          isGuest: false,
          syncError: null,
          onboardingComplete: false
        });
      },



      
      completeOnboarding: (data) => set((state) => {
        const newState = {
          ...data,
          onboardingComplete: true,
          xp: (state.xp || 0) + 100,
          coins: (state.coins || 0) + 50
        };
        if (state.user && !state.isGuest) {
          debouncedSaveProgress(state.user.email, { ...state, ...newState });
        }
        return newState;
      }),
      
      updateCharacter: (characterId) => set({ character: characterId }),

      setDailyGoalMinutes: (mins) => set({ dailyGoalMinutes: mins }),

      toggleGithubConnection: () => set((state) => ({ githubConnected: !state.githubConnected })),
      toggleLinkedinConnection: () => set((state) => ({ linkedinConnected: !state.linkedinConnected })),

      clearNewAchievementToast: () => set({ newUnlockedAchievement: null }),
      
      addXp: (amount) => set((state) => {
        const newXp = (state.xp || 0) + amount;
        const newLevel = Math.floor(newXp / 500) + 1;
        const newState = { xp: newXp, level: Math.max(state.level || 1, newLevel) };
        
        if (state.user && !state.isGuest) {
          // Debounced save to Google Sheets (waits 1500ms after latest XP change)
          debouncedSaveProgress(state.user.email, { ...state, ...newState });
        }
        
        return newState;
      }),

      addCoins: (amount) => set((state) => ({ coins: (state.coins || 0) + amount })),

      completeMission: (missionId, xpReward = 50, coinReward = 20) => set((state) => {
        if (state.isGuest) return state;
        const currentMissions = state.completedMissions || [];
        // Prevent duplicate execution or duplicate increments
        if (currentMissions.includes(missionId)) {
          return state;
        }

        console.log("MISSION COMPLETED:", missionId);

        const completedMissions = [...currentMissions, missionId];
        const newXp = (state.xp || 0) + xpReward;
        const newLevel = Math.floor(newXp / 500) + 1;
        const newCoins = (state.coins || 0) + coinReward;
        const newActivity = Math.min(state.dailyGoalMinutes || 20, (state.todayActivityMinutes || 0) + 5);

        // Check for achievements
        let earnedAchievements = state.earnedAchievements || [];
        let newUnlocked = null;

        if (!earnedAchievements.includes('c1_m1')) {
          earnedAchievements = [...earnedAchievements, 'c1_m1'];
          newUnlocked = 'FIRST CASE';
        }

        const newState = {
          completedMissions,
          xp: newXp,
          level: Math.max(state.level || 1, newLevel),
          coins: newCoins,
          todayActivityMinutes: newActivity,
          earnedAchievements,
          newUnlockedAchievement: newUnlocked
        };

        if (state.user && !state.isGuest) {
          const emailKey = normalizeEmail(state.user.email);
          saveAccountProgress(emailKey, { ...state, ...newState });
          debouncedSaveProgress(emailKey, { ...state, ...newState });
        }

        return newState;
      }),

      completeChapter: (chapterId, stars = 3) => set((state) => {
        if (state.isGuest) return state;
        const currentChapters = state.completedChapters || [];
        const completedChapters = currentChapters.includes(chapterId)
          ? currentChapters
          : [...currentChapters, chapterId];

        const nextChapterId = Number(chapterId) + 1;
        const currentUnlocked = state.unlockedChapters || [1];
        const unlockedChapters = currentUnlocked.includes(nextChapterId)
          ? currentUnlocked
          : [...currentUnlocked, nextChapterId];

        // Check for achievements
        let earnedAchievements = state.earnedAchievements || [];
        let newUnlocked = null;

        if (!earnedAchievements.includes('c1_chapter')) {
          earnedAchievements = [...earnedAchievements, 'c1_chapter'];
          newUnlocked = 'CASE SOLVED';
        }

        const newState = {
          completedChapters,
          unlockedChapters,
          chapterStars: {
            ...(state.chapterStars || {}),
            [chapterId]: Math.max((state.chapterStars || {})[chapterId] || 0, stars)
          },
          earnedAchievements,
          newUnlockedAchievement: newUnlocked
        };

        if (state.user && !state.isGuest) {
          const emailKey = normalizeEmail(state.user.email);
          saveAccountProgress(emailKey, { ...state, ...newState });
          debouncedSaveProgress(emailKey, { ...state, ...newState });
        }

        return newState;
      })
    }),
    {
      name: 'codesaga-storage',
    }
  )
);

export default useStore;
