import { isDeveloper } from './userRole.js';

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

  // Check if certificate is already issued in user state or cloud database
  const hasIssuedCertificate = Boolean(
    storeState.certificates?.certificateIssued ||
    storeState.certificateIssued ||
    storeState.certificates?.certificateId ||
    storeState.certificateId
  );

  if (hasIssuedCertificate) {
    const certId = storeState.certificates?.certificateId || storeState.certificateId || 'CS-VERIFIED';
    return {
      isEligible: true,
      hasExistingCertificate: true,
      certificateId: certId,
      reason: `Official Certificate (${certId}) verified and accessible.`,
      progressPercentage: 100,
      completedChaptersCount: storeState.completedChapters?.length || 0,
      completedMissionsCount: storeState.completedMissions?.length || 0
    };
  }

  const userEmail = String(storeState.user?.email || '').trim().toLowerCase();
  const isSpecial = userEmail === 'deepkanair8@gmail.com';
  const isDev = !isSpecial && isDeveloper(storeState.user);
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
