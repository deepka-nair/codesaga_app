import { isDeveloper } from './userRole';

export function checkCertificateEligibility(storeState = {}) {
  if (!storeState.user || storeState.isGuest) {
    return {
      isEligible: false,
      reason: 'Authentication required. Guests cannot claim certificates.',
      progressPercentage: 0,
      completedChaptersCount: 0,
      isDeveloperTesting: false
    };
  }

  // Developer Role Access Rule: Developer gets full testing access to certificates
  const isDev = isDeveloper(storeState.user);
  if (isDev) {
    return {
      isEligible: true,
      isDeveloperTesting: true,
      reason: '🛠️ DEVELOPER MODE: Unrestricted certificate testing access granted.',
      progressPercentage: 100,
      completedChaptersCount: storeState.completedChapters?.length || 0,
      completedMissionsCount: storeState.completedMissions?.length || 0
    };
  }

  const sqlChapters = (storeState.sqlProgress?.completedChapters || []).length;
  const pythonChapters = (storeState.pythonProgress?.completedChapters || []).length;
  const javaChapters = (storeState.javaProgress?.completedChapters || []).length;
  const frontendChapters = (storeState.frontendProgress?.completedChapters || []).length;
  const cppChapters = (storeState.cppProgress?.completedChapters || []).length;
  const backendChapters = (storeState.backendProgress?.completedChapters || []).length;

  const totalCompletedChapters = Array.isArray(storeState.completedChapters)
    ? Math.max(
        storeState.completedChapters.length,
        sqlChapters + pythonChapters + javaChapters + frontendChapters + cppChapters + backendChapters
      )
    : (sqlChapters + pythonChapters + javaChapters + frontendChapters + cppChapters + backendChapters);

  const completedMissionsCount = Array.isArray(storeState.completedMissions)
    ? storeState.completedMissions.length
    : 0;

  // Normal User Requirement: Must complete at least 1 Chapter or 1 Mission
  const isEligible = totalCompletedChapters >= 1 || completedMissionsCount >= 1;

  return {
    isEligible,
    isDeveloperTesting: false,
    reason: isEligible 
      ? 'Congratulations! You have satisfied the CodeSaga completion requirements.' 
      : 'Complete your first chapter or mission in any CodeSaga world to unlock your certificate.',
    progressPercentage: Math.min(100, Math.round((totalCompletedChapters / 1) * 100)),
    completedChaptersCount: totalCompletedChapters,
    completedMissionsCount
  };
}
