import { SQL_CURRICULUM } from '../../src/data/sqlCurriculum.js';
import { PYTHON_CURRICULUM } from '../../src/data/pythonCurriculum.js';
import { JAVA_CURRICULUM } from '../../src/data/javaCurriculum.js';
import { FRONTEND_CURRICULUM } from '../../src/data/frontendCurriculum.js';
import { CPP_CURRICULUM } from '../../src/data/cppCurriculum.js';
import { BACKEND_CURRICULUM } from '../../src/data/backendCurriculum.js';
export const worlds = [
  ['sql', 'sql-detective', SQL_CURRICULUM], ['python', 'python-valley', PYTHON_CURRICULUM],
  ['java', 'java-kingdom', JAVA_CURRICULUM], ['frontend', 'web-creator', FRONTEND_CURRICULUM],
  ['cpp', 'cpp-arena', CPP_CURRICULUM], ['backend', 'server-fortress', BACKEND_CURRICULUM]
];
const lists = worlds.map(([world, route, chapters]) => chapters.flatMap(chapter => chapter.missions.map(mission => ({ world, route, chapter, mission }))));
// Balanced, deterministic selection of 500 distinct curriculum missions (589 exist).
export const missions = [];
for (let i = 0; missions.length < 500; i++) for (const list of lists) if (list[i] && missions.length < 500) missions.push(list[i]);
export const chapters = worlds.flatMap(([world, route, cs]) => cs.map(chapter => ({ world, chapter, path: `/${route}/chapter/${chapter.id}` })));
export const browserCases = chapters.flatMap(c => [
  'Anonymous route redirects to login', 'Guest chapter preview policy', 'Guest session flag remains true',
  'Guest role remains guest', 'No earned certificate is fabricated', 'Paywall or real first mission is visible',
  'Rendered document is readable without a runtime error'
].map((check, property) => ({ ...c, property, name: `${c.world} chapter ${c.chapter.id}: ${check}` }))).slice(0, 500);
