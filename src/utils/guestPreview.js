/**
 * CodeSaga Central Guest Preview Evaluator
 * Defines preview boundaries and helpers for unauthenticated Guest sessions.
 */

export const GUEST_PREVIEW_LIMITS = {
  maxWorlds: 6,
  maxChaptersPerWorld: 1,
  maxMissionsPerChapter: 2
};

/**
 * Check if current session is an unauthenticated guest
 */
export function isGuestUser(storeState = {}) {
  return Boolean(storeState.isGuest || !storeState.user || (storeState.user?.email && storeState.user.email.startsWith('guest_')));
}

/**
 * Check if a guest can complete a mission (Always false for guests)
 */
export function canCompleteMission(storeState = {}) {
  return !isGuestUser(storeState);
}

/**
 * Check if a guest can complete a chapter (Always false for guests)
 */
export function canCompleteChapter(storeState = {}) {
  return !isGuestUser(storeState);
}

/**
 * Check if mission index is within guest preview limits
 */
export function canAccessMission(storeState = {}, missionIndex = 0) {
  if (!isGuestUser(storeState)) return true;
  return missionIndex < GUEST_PREVIEW_LIMITS.maxMissionsPerChapter;
}
