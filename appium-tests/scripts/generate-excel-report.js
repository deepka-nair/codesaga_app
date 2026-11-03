import ExcelJS from 'exceljs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { scenarios } from '../tests/scenario-register.js';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export async function generateAppiumReportFromResults(results) {
  if (!results || results.length !== 310 || new Set(results.map(r => r.id)).size !== 310)
    throw new Error('Expected 310 unique registered scenario results; refusing to manufacture missing results.');
  const valid = ['Pass', 'Fail', 'Skipped', 'Blocked', 'Not Implemented'];
  for (const r of results) {
    if (!valid.includes(r.status)) throw new Error(`Invalid result status: ${r.id}`);
    if (!r.implemented && r.status !== 'Not Implemented') throw new Error(`Placeholder misclassified: ${r.id}`);
  }
  const counts = Object.fromEntries(valid.map(s => [s, results.filter(r => r.status === s).length]));
  const sha = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  const evidence = { commit: sha, runUrl: process.env.GITHUB_RUN_ID ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : null,
    generatedAt: new Date().toISOString(), mode: process.env.RUN_LIVE_APPIUM === 'true' ? 'live' : 'inventory',
    registered: 310, implemented: scenarios.filter(s => s.implemented).length, counts, results };
  const book = new ExcelJS.Workbook();
  const summary = book.addWorksheet('Executive Summary');
  summary.addRows([['CodeSaga Mobile Coverage'], ['Commit', sha], ['Mode', evidence.mode],
    ['Registered', 310], ['Implemented', evidence.implemented], ...Object.entries(counts),
    ['Note', 'Not Implemented is separate from Blocked; Mocha pending includes both. Smoke suite is separate.']]);
  const detail = book.addWorksheet('Scenario Register');
  detail.addRow(['ID', 'Category', 'Scenario', 'Implemented', 'Status', 'Actual evidence / blocker']);
  results.forEach(r => detail.addRow([r.id, r.category, r.title, r.implemented ? 'Yes' : 'No', r.status, r.actual]));
  for (const sheet of book.worksheets) {
    sheet.getRow(1).font = { bold: true }; sheet.views = [{ state: 'frozen', ySplit: 1 }];
    sheet.columns.forEach((c, i) => { c.width = i > 0 ? 42 : 24; });
    sheet.eachRow(row => row.alignment = { vertical: 'top', wrapText: true });
  }
  const dir = path.join(root, 'appium-tests/results'); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'mobile-results.json'), JSON.stringify(evidence, null, 2));
  fs.writeFileSync(path.join(dir, 'mobile-coverage.md'), `# Mobile coverage\n\nCommit: ${sha}\nMode: ${evidence.mode}\n\n| Status | Count |\n|---|---:|\n${Object.entries(counts).map(([s,n]) => `| ${s} | ${n} |`).join('\n')}\n\n310 registered; ${evidence.implemented} implemented. The five smoke tests are additional and are not 310-scenario passes.\n`);
  await book.xlsx.writeFile(path.join(root, 'appium-tests/Appium_Test_Cases_Report.xlsx'));
  console.log(JSON.stringify({ ...counts, implemented: evidence.implemented, registered: 310 }));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  // Explicit inventory generation never invents passes or device execution.
  await generateAppiumReportFromResults(scenarios.map(s => ({ ...s,
    status: s.implemented ? 'Blocked' : 'Not Implemented', actual: 'Inventory only; no device execution performed.' })));
}
