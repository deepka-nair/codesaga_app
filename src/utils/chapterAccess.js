/**
 * CodeSaga Chapter Access & Unlocking Engine
 * -------------------------------------------------------------
 * Rules:
 * 1. For every account except deepkanair8@gmail.com:
 *    - All worlds and chapters are initially visible.
 *    - Chapter 1 is playable immediately in all worlds.
 *    - When Chapter 1 is completed, Chapter 2 unlocks.
 *    - Completing Chapter 2 unlocks Chapter 3, and so on.
 *    - Each subsequent chapter unlocks after the immediately preceding chapter is completed.
 *    - Unrelated worlds do not block progression (each world is independent).
 *    - Incomplete chapters do not unlock subsequent chapters.
 * 2. Exception — deepkanair8@gmail.com:
 *    - Preserve this account's existing access restrictions and progression behavior.
 *    - Chapter is unlocked only if in unlockedChapters or if the preceding chapter is completed.
 *    - Developer bypass rules do NOT grant unrestricted chapter access to this account.
 * 3. Guest Mode:
 *    - Chapter 1 is playable.
 *    - Chapters 2+ are locked behind guest preview limit.
 */

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function isSpecialRestrictedAccount(userObj = null) {
  if (!userObj) return false;
  const email = normalizeEmail(userObj.email || userObj.id);
  return email === 'deepkanair8@gmail.com';
}

/**
 * Determine if a chapter in a specific world is unlocked for the current user state.
 *
 * @param {string} worldId - World identifier ('sql', 'python', 'java', 'frontend', 'cpp', 'backend')
 * @param {number|string} chapterId - Chapter number (1, 2, 3...)
 * @param {object} userState - Full user state object
 * @returns {boolean} Whether the chapter is unlocked and playable
 */
export function isChapterUnlocked(worldId, chapterId, userState = {}) {
  const chNum = Number(chapterId);
  // Chapter 1 is always playable immediately for all accounts
  if (chNum <= 1) return true;

  const { user, isGuest } = userState;
  if (isGuest) return false;

  const userEmail = normalizeEmail(user?.email || user?.id);
  const isSpecial = userEmail === 'deepkanair8@gmail.com';

  const targetWorldKey = `${worldId}Progress`;
  const worldData = userState.worldProgress?.[targetWorldKey] || {};

  const completedInWorld = Array.isArray(worldData.completedChapters)
    ? worldData.completedChapters
    : (worldId === 'sql' && Array.isArray(userState.completedChapters) ? userState.completedChapters : []);

  const unlockedInWorld = Array.isArray(worldData.unlockedChapters)
    ? worldData.unlockedChapters
    : (worldId === 'sql' && Array.isArray(userState.unlockedChapters) ? userState.unlockedChapters : [1]);

  // If already unlocked in this world
  if (unlockedInWorld.includes(chNum)) return true;

  // Chapter N unlocks when Chapter N - 1 has been completed
  if (completedInWorld.includes(chNum - 1)) {
    return true;
  }

  return false;
}

/**
 * Get all unlocked chapters for a world
 */
export function getUnlockedChaptersForWorld(worldId, userState = {}, totalChapters = 12) {
  const unlocked = [];
  for (let ch = 1; ch <= totalChapters; ch++) {
    if (isChapterUnlocked(worldId, ch, userState)) {
      unlocked.push(ch);
    }
  }
  return unlocked;
}
