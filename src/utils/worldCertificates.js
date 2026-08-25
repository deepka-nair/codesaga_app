/**
 * CodeSaga 6 World Certificates Configuration & Helper Utilities
 */

export const WORLD_CERTIFICATES = {
  sql: {
    id: "sql",
    worldNumber: 1,
    name: "DATABASE DETECTIVE CITY",
    language: "SQL Database Architecture",
    totalChapters: 14,
    codePrefix: "CS-W1",
    badge: "🕵️‍♂️"
  },
  python: {
    id: "python",
    worldNumber: 2,
    name: "PYTHON VALLEY",
    language: "Python Logic & Data Structures",
    totalChapters: 12,
    codePrefix: "CS-W2",
    badge: "🐍"
  },
  java: {
    id: "java",
    worldNumber: 3,
    name: "JAVA KINGDOM",
    language: "Java Object-Oriented Systems",
    totalChapters: 12,
    codePrefix: "CS-W3",
    badge: "☕"
  },
  frontend: {
    id: "frontend",
    worldNumber: 4,
    name: "WEB CREATOR CITY",
    language: "Frontend Web Engineering (HTML/CSS/JS)",
    totalChapters: 12,
    codePrefix: "CS-W4",
    badge: "🌐"
  },
  cpp: {
    id: "cpp",
    worldNumber: 5,
    name: "C++ CYBER ARENA",
    language: "C++ High-Performance Systems",
    totalChapters: 12,
    codePrefix: "CS-W5",
    badge: "⚙️"
  },
  backend: {
    id: "backend",
    worldNumber: 6,
    name: "SERVER FORTRESS",
    language: "Backend Microservices & API Architecture",
    totalChapters: 12,
    codePrefix: "CS-W6",
    badge: "🛡️"
  }
};

/**
 * Check if a specific world is 100% completed based on actual completed chapters count
 */
export function isWorldCompleted(worldId, storeState = {}) {
  const config = WORLD_CERTIFICATES[worldId];
  if (!config) return false;

  let completedChaptersCount = 0;

  if (worldId === 'sql') {
    completedChaptersCount = (storeState.sqlProgress?.completedChapters || storeState.completedChapters || []).length;
  } else if (worldId === 'python') {
    completedChaptersCount = (storeState.pythonProgress?.completedChapters || []).length;
  } else if (worldId === 'java') {
    completedChaptersCount = (storeState.javaProgress?.completedChapters || []).length;
  } else if (worldId === 'frontend') {
    completedChaptersCount = (storeState.frontendProgress?.completedChapters || []).length;
  } else if (worldId === 'cpp') {
    completedChaptersCount = (storeState.cppProgress?.completedChapters || []).length;
  } else if (worldId === 'backend') {
    completedChaptersCount = (storeState.backendProgress?.completedChapters || []).length;
  }

  return completedChaptersCount >= config.totalChapters;
}

/**
 * Count total earned certificates out of 6
 */
export function getEarnedCertificatesCount(storeState = {}) {
  let count = 0;
  Object.keys(WORLD_CERTIFICATES).forEach((wId) => {
    if (isWorldCompleted(wId, storeState)) {
      count++;
    }
  });
  return count;
}
