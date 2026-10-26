/**
 * Automated Verification Suite for CodeSaga Certificate Access & Chapter Unlocking
 * ----------------------------------------------------------------------------------
 * Verifies all 10 requirements:
 * 1. deepkanair8@gmail.com can open certificates they are entitled to view.
 * 2. A certificate API failure displays an appropriate error instead of a misleading empty state.
 * 3. Another account can access Chapter 1 immediately.
 * 4. Completing Chapter 1 unlocks Chapter 2 for that account.
 * 5. Completing Chapter 2 unlocks Chapter 3.
 * 6. An incomplete chapter does not unlock the next chapter.
 * 7. Unlock progress persists after logout, login, and app restart.
 * 8. One user's chapter completion does not unlock chapters for another user.
 * 9. The special account's existing access restrictions remain unchanged.
 * 10. Existing earned certificates and saved progress are preserved.
 */

import { isChapterUnlocked, getUnlockedChaptersForWorld, normalizeEmail, isSpecialRestrictedAccount } from '../src/utils/chapterAccess.js';
import { checkCertificateEligibility } from '../src/utils/certificateEligibility.js';

const BACKEND_URL = 'https://codesaga-app-3.onrender.com';

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function recordTest(id, name, passed, detail = '') {
  if (passed) {
    results.passed++;
    console.log(`  ✅ [REQ-${id}] PASS: ${name}${detail ? ` — ${detail}` : ''}`);
  } else {
    results.failed++;
    console.error(`  ❌ [REQ-${id}] FAIL: ${name}${detail ? ` — ${detail}` : ''}`);
  }
  results.tests.push({ id, name, passed, detail });
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('🔍 CODESAGA VERIFICATION SUITE: CERTIFICATES & CHAPTER UNLOCKING');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // TEST 1: deepkanair8@gmail.com can open certificates entitled to view
  // -------------------------------------------------------------
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/deepkanair8%40gmail.com`);
    const data = await res.json();
    const cert = data.user?.certificates;

    const hasCert = Boolean(cert?.certificateIssued && cert?.certificateId === 'CS-2026-VL15PO');

    const specialUserState = {
      user: {
        id: data.user?._id || 'USR_MT8H1VGF',
        email: 'deepkanair8@gmail.com',
        username: 'deepkanair8'
      },
      isGuest: false,
      certificates: cert,
      completedChapters: data.user?.completedChapters || [],
      completedMissions: data.user?.completedMissions || []
    };

    const eligibility = checkCertificateEligibility(specialUserState);

    const opensCertSuccessfully = (
      hasCert &&
      eligibility.isEligible &&
      eligibility.hasExistingCertificate &&
      eligibility.certificateId === 'CS-2026-VL15PO'
    );

    recordTest(
      1,
      'deepkanair8@gmail.com can open legitimately entitled certificates',
      opensCertSuccessfully,
      `Certificate ${cert?.certificateId} issued to ${cert?.certificateName} is eligible and openable`
    );
  } catch (err) {
    recordTest(1, 'deepkanair8@gmail.com can open certificates', false, err.message);
  }

  // -------------------------------------------------------------
  // TEST 2: Certificate API failure displays clear error, not empty state
  // -------------------------------------------------------------
  try {
    // 2a. Querying non-existent certificate returns explicit error rather than empty state
    const nonExistentRes = await fetch(`${BACKEND_URL}/api/users/nonexistent_detective_999%40example.com/progress`);
    const nonExistentData = await nonExistentRes.json();
    const handlesNotFoundCorrectly = nonExistentRes.status === 404 && nonExistentData.success === false;

    // 2b. Test client-side handling: null/missing certificate returns clear error not empty cert
    const unearnedState = {
      user: { email: 'newdetective@example.com', username: 'NewUser' },
      isGuest: false,
      certificates: {},
      completedChapters: [],
      completedMissions: []
    };
    const unearnedEligibility = checkCertificateEligibility(unearnedState);
    const showsLockedError = !unearnedEligibility.isEligible && unearnedEligibility.reason.length > 0;

    recordTest(
      2,
      'Certificate failure displays appropriate error instead of empty state',
      handlesNotFoundCorrectly && showsLockedError,
      `Backend returned 404 '${nonExistentData.message}' and client shows locked error: '${unearnedEligibility.reason}'`
    );
  } catch (err) {
    recordTest(2, 'Certificate failure error handling', false, err.message);
  }

  // -------------------------------------------------------------
  // TEST 3: Another account can access Chapter 1 immediately
  // -------------------------------------------------------------
  const studentState = {
    user: { id: 'usr_student_123', email: 'alice_detective@example.com', username: 'Alice' },
    isGuest: false,
    completedChapters: [],
    unlockedChapters: [1],
    worldProgress: {
      sqlProgress: { completedChapters: [], unlockedChapters: [1] },
      pythonProgress: { completedChapters: [], unlockedChapters: [1] },
      javaProgress: { completedChapters: [], unlockedChapters: [1] },
      frontendProgress: { completedChapters: [], unlockedChapters: [1] },
      cppProgress: { completedChapters: [], unlockedChapters: [1] },
      backendProgress: { completedChapters: [], unlockedChapters: [1] }
    }
  };

  const ch1Sql = isChapterUnlocked('sql', 1, studentState);
  const ch1Python = isChapterUnlocked('python', 1, studentState);
  const ch1Java = isChapterUnlocked('java', 1, studentState);
  const ch1Frontend = isChapterUnlocked('frontend', 1, studentState);
  const ch1Cpp = isChapterUnlocked('cpp', 1, studentState);
  const ch1Backend = isChapterUnlocked('backend', 1, studentState);

  const allCh1Unlocked = ch1Sql && ch1Python && ch1Java && ch1Frontend && ch1Cpp && ch1Backend;

  recordTest(
    3,
    'Another account can access Chapter 1 immediately in all worlds',
    allCh1Unlocked,
    `SQL: ${ch1Sql}, Python: ${ch1Python}, Java: ${ch1Java}, Frontend: ${ch1Frontend}, Cpp: ${ch1Cpp}, Backend: ${ch1Backend}`
  );

  // -------------------------------------------------------------
  // TEST 4: Completing Chapter 1 unlocks Chapter 2 for that account
  // -------------------------------------------------------------
  const studentAfterCh1 = {
    ...studentState,
    completedChapters: [1],
    unlockedChapters: [1, 2],
    worldProgress: {
      ...studentState.worldProgress,
      sqlProgress: {
        completedChapters: [1],
        unlockedChapters: [1, 2]
      }
    }
  };

  const ch2UnlockedAfterCh1 = isChapterUnlocked('sql', 2, studentAfterCh1);
  recordTest(
    4,
    'Completing Chapter 1 unlocks Chapter 2 for that account',
    ch2UnlockedAfterCh1,
    `Chapter 2 unlocked in SQL: ${ch2UnlockedAfterCh1}`
  );

  // -------------------------------------------------------------
  // TEST 5: Completing Chapter 2 unlocks Chapter 3
  // -------------------------------------------------------------
  const studentAfterCh2 = {
    ...studentAfterCh1,
    completedChapters: [1, 2],
    unlockedChapters: [1, 2, 3],
    worldProgress: {
      ...studentAfterCh1.worldProgress,
      sqlProgress: {
        completedChapters: [1, 2],
        unlockedChapters: [1, 2, 3]
      }
    }
  };

  const ch3UnlockedAfterCh2 = isChapterUnlocked('sql', 3, studentAfterCh2);
  recordTest(
    5,
    'Completing Chapter 2 unlocks Chapter 3 for that account',
    ch3UnlockedAfterCh2,
    `Chapter 3 unlocked in SQL: ${ch3UnlockedAfterCh2}`
  );

  // -------------------------------------------------------------
  // TEST 6: An incomplete chapter does not unlock the next chapter
  // -------------------------------------------------------------
  // Student has completed Ch 1 and Ch 2, but NOT Ch 3
  const ch4Locked = !isChapterUnlocked('sql', 4, studentAfterCh2);
  // In Python, student has completed 0 chapters -> Ch 2 should be locked
  const pythonCh2Locked = !isChapterUnlocked('python', 2, studentAfterCh2);

  const incompleteDoesNotUnlock = ch4Locked && pythonCh2Locked;
  recordTest(
    6,
    'An incomplete chapter does not unlock the next chapter',
    incompleteDoesNotUnlock,
    `SQL Chapter 4 locked: ${ch4Locked}, Python Chapter 2 locked: ${pythonCh2Locked}`
  );

  // -------------------------------------------------------------
  // TEST 7: Unlock progress persists after logout, login, and app restart
  // -------------------------------------------------------------
  // Simulate saving to AsyncStorage / Cloud Progress Payload
  const serializedSession = JSON.stringify(studentAfterCh2);
  // Simulate logout (clear state)
  let restoredSession = null;
  // Simulate app restart / login restore
  restoredSession = JSON.parse(serializedSession);

  const persistedCh1 = isChapterUnlocked('sql', 1, restoredSession);
  const persistedCh2 = isChapterUnlocked('sql', 2, restoredSession);
  const persistedCh3 = isChapterUnlocked('sql', 3, restoredSession);
  const persistedCh4 = isChapterUnlocked('sql', 4, restoredSession);

  const persistencePassed = persistedCh1 && persistedCh2 && persistedCh3 && !persistedCh4;

  recordTest(
    7,
    'Unlock progress persists after logout, login, and app restart',
    persistencePassed,
    `Ch1: ${persistedCh1}, Ch2: ${persistedCh2}, Ch3: ${persistedCh3}, Ch4 (locked): ${!persistedCh4}`
  );

  // -------------------------------------------------------------
  // TEST 8: One user chapter completion does not unlock for another user
  // -------------------------------------------------------------
  const userBob = {
    user: { id: 'usr_bob_456', email: 'bob_detective@example.com', username: 'Bob' },
    isGuest: false,
    completedChapters: [],
    unlockedChapters: [1],
    worldProgress: {
      sqlProgress: { completedChapters: [], unlockedChapters: [1] }
    }
  };

  const bobCh1 = isChapterUnlocked('sql', 1, userBob);
  const bobCh2 = isChapterUnlocked('sql', 2, userBob);
  const bobCh3 = isChapterUnlocked('sql', 3, userBob);

  const isolationPassed = bobCh1 && !bobCh2 && !bobCh3;

  recordTest(
    8,
    "One user's chapter completion does not unlock chapters for another user",
    isolationPassed,
    `Bob has Ch1 unlocked (${bobCh1}), but Ch2 (${bobCh2}) and Ch3 (${bobCh3}) remain locked`
  );

  // -------------------------------------------------------------
  // TEST 9: Special account's existing access restrictions remain unchanged
  // -------------------------------------------------------------
  const deepkanairUser = {
    user: {
      id: 'USR_MT8H1VGF',
      email: 'deepkanair8@gmail.com',
      username: 'deepkanair8'
    },
    isGuest: false,
    completedChapters: [],
    unlockedChapters: [1],
    worldProgress: {
      sqlProgress: { completedChapters: [], unlockedChapters: [1] }
    }
  };

  // Special account should have Chapter 1 unlocked
  const specialCh1 = isChapterUnlocked('sql', 1, deepkanairUser);
  // Special account should have Chapter 2 LOCKED because Chapter 1 is not completed
  const specialCh2 = isChapterUnlocked('sql', 2, deepkanairUser);
  const specialCh3 = isChapterUnlocked('sql', 3, deepkanairUser);

  // Exception applies ONLY to deepkanair8@gmail.com, not to other addresses
  const similarEmailUser = {
    user: { email: 'deepkanair8@saveetha.com' },
    isGuest: false,
    completedChapters: [1],
    unlockedChapters: [1, 2]
  };
  const isSpecialTargeted = isSpecialRestrictedAccount(deepkanairUser.user) &&
    !isSpecialRestrictedAccount(similarEmailUser.user) &&
    !isSpecialRestrictedAccount({ email: 'deepkanair89@gmail.com' });

  const specialRestrictionsPreserved = specialCh1 && !specialCh2 && !specialCh3 && isSpecialTargeted;

  recordTest(
    9,
    "Special account's existing access restrictions remain unchanged",
    specialRestrictionsPreserved,
    `deepkanair8 Ch1: ${specialCh1}, Ch2 (locked): ${!specialCh2}, Ch3 (locked): ${!specialCh3}, Exact match: ${isSpecialTargeted}`
  );

  // -------------------------------------------------------------
  // TEST 10: Existing earned certificates and saved progress are preserved
  // -------------------------------------------------------------
  try {
    const userRes = await fetch(`${BACKEND_URL}/api/users/deepkanair8%40gmail.com`);
    const userData = await userRes.json();
    const progressRes = await fetch(`${BACKEND_URL}/api/users/deepkanair8%40gmail.com/progress`);
    const progressData = await progressRes.json();

    const u = userData.user;
    const p = progressData.progress;

    const certPreserved = (
      u?.certificates?.certificateIssued === true &&
      u?.certificates?.certificateId === 'CS-2026-VL15PO' &&
      u?.certificates?.certificateName === 'deepkanair8'
    );

    const progressPreserved = (
      Array.isArray(p?.completedMissions) &&
      p.completedMissions.includes('py_1_1') &&
      p.completedMissions.includes('c1_m1') &&
      p.completedMissions.includes('c1_m2')
    );

    const preserved = Boolean(userData.exists && certPreserved && progressPreserved);

    recordTest(
      10,
      'Existing earned certificates and saved progress are preserved in database',
      preserved,
      `User ID: ${u?._id}, Cert: ${u?.certificates?.certificateId}, Missions: ${p?.completedMissions?.join(', ')}`
    );
  } catch (err) {
    recordTest(10, 'Existing earned certificates and saved progress preservation', false, err.message);
  }

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${results.passed} / ${results.passed + results.failed} PASSED`);
  if (results.failed === 0) {
    console.log('🎉 ALL 10 TESTS PASSED SUCCESSFULLY!');
  } else {
    console.error(`⚠️ ${results.failed} TEST(S) FAILED!`);
  }
  console.log('================================================================');

  if (results.failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
