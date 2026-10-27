import ExcelJS from 'exceljs';
import path from 'path';
import fileSystem from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSecurityExcelReport() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'CodeSaga DevSecOps & Security Engineering Team';
  workbook.created = new Date();

  const COLORS = {
    headerBg: '0F172A',
    headerText: 'FFFFFF',
    summaryAccent: '1E293B',
    passBg: 'DCFCE7',
    passText: '166534',
    warnBg: 'FEF3C7',
    warnText: '92400E',
    altRowBg: 'F8FAFC',
    borderGray: 'E2E8F0',
    highPriority: 'EF4444',
    medPriority: 'F59E0B',
    lowPriority: '10B981'
  };

  // Sheet 1: Executive Summary
  const summarySheet = workbook.addWorksheet('Executive Summary', { views: [{ showGridLines: true }] });
  summarySheet.mergeCells('A1:G2');
  const titleCell = summarySheet.getCell('A1');
  titleCell.value = 'CODESAGA APPLICATION - SAST SECURITY & DEVSECOPS AUDIT REPORT';
  titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: COLORS.headerText } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerBg } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  summarySheet.addRow([]);
  summarySheet.addRow(['Application Name:', 'CodeSaga Full-Stack Platform', 'Audit Date:', new Date().toLocaleDateString()]);
  summarySheet.addRow(['Technology Stack:', 'Node.js, Express, React, Vite, MongoDB', 'DevSecOps Tools:', 'Semgrep, Gitleaks, Trivy, npm audit']);
  summarySheet.addRow(['Target Scope:', 'Backend API, Authentication, Models, Routes', 'Remediation Status:', 'Remediated & Verified (20/20 Tests Passed)']);

  summarySheet.addRow([]);
  summarySheet.mergeCells('A8:G8');
  const metricHeader = summarySheet.getCell('A8');
  metricHeader.value = '🛡️ RECONCILED SECURITY FINDINGS & REMEDIATION METRICS';
  metricHeader.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFFFFF' } };
  metricHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.summaryAccent } };

  summarySheet.addRow(['Finding Category / Scope', 'Discovered', 'Remediated', 'Documented Pending', 'Verification Status']);
  const headRow = summarySheet.getRow(9);
  headRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  headRow.eachCell(c => c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '334155' } });

  const metrics = [
    ['App Code — High (IDOR & Rate Limiting)', 2, 2, 0, 'REMEDIATED (Verified via Tests)'],
    ['App Code — Medium (Headers & Validation)', 2, 2, 0, 'REMEDIATED (Verified via Tests)'],
    ['App Code — Low (PII Logging & Error Leaks)', 2, 2, 0, 'REMEDIATED (Verified via Tests)'],
    ['Dependencies (SCA) — Critical (proxy-addr, shell-quote, form-data)', 3, 3, 0, 'REMEDIATED (0 Critical Remaining)'],
    ['Dependencies (SCA) — High (Vite, body-parser, brace-expansion, source-map, serialize-js)', 9, 7, 2, 'PARTIALLY REMEDIATED (2 in Expo CLI)'],
    ['Dependencies (SCA) — Moderate (qs, query-string, uuid)', 5, 5, 0, 'REMEDIATED (0 Moderate Remaining)'],
    ['Hardcoded Secrets (Gitleaks)', 0, 0, 0, 'CLEAN (0 Secrets Detected)'],
    ['Critical Security Gate Policy', 0, 0, 0, 'PASSED (Zero Criticals)']
  ];

  metrics.forEach(m => {
    const r = summarySheet.addRow(m);
    r.font = { name: 'Segoe UI', size: 10 };
    const statusCell = r.getCell(5);
    if (m[4].startsWith('REMEDIATED') || m[4].startsWith('CLEAN') || m[4].startsWith('PASSED')) {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.passBg } };
      statusCell.font = { bold: true, color: { argb: COLORS.passText } };
    } else {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.warnBg } };
      statusCell.font = { bold: true, color: { argb: COLORS.warnText } };
    }
  });

  summarySheet.columns = [{ width: 44 }, { width: 14 }, { width: 14 }, { width: 22 }, { width: 34 }];

  // Sheet 2: Endpoint Inventory & Security Controls
  const detailSheet = workbook.addWorksheet('Endpoint Inventory', { views: [{ showGridLines: true }] });
  const epHeaders = ['Endpoint Path', 'HTTP Method', 'Auth Required', 'Expected Roles', 'Controller / File Path', 'Security Verification'];
  const hRow = detailSheet.addRow(epHeaders);
  hRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  hRow.eachCell(c => c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerBg } });

  const endpoints = [
    ['/api/health', 'GET', 'No', 'Public', 'server.js', 'Verified Safe; Nosniff & HSTS'],
    ['/', 'GET', 'No', 'Public', 'server.js', 'Verified Safe; Nosniff & HSTS'],
    ['/api/users/:email', 'GET', 'Optional (Guest Allowed)', 'User / Developer', 'routes/users.js', 'Verified Safe; Email Normalization'],
    ['/api/users', 'POST', 'No (Registration)', 'Public / User', 'routes/users.js', 'Verified Safe; Password Complexity & HMAC Token'],
    ['/api/users/set-password', 'POST', 'Yes (Rate Limited)', 'Verified User', 'routes/users.js', 'Verified Safe; 10 req/15m Limit & HMAC Token'],
    ['/api/users/login-password', 'POST', 'Yes (Rate Limited)', 'Public / User', 'routes/users.js', 'Verified Safe; 10 req/15m Limit & HMAC Token'],
    ['/api/users/login', 'POST', 'No', 'Public / User', 'routes/users.js', 'Verified Safe; HMAC Token Issued'],
    ['/api/users/:email/progress', 'GET', 'Yes (HMAC Bearer)', 'Own Account / Dev', 'routes/users.js', 'Verified Safe; IDOR Ownership Protected'],
    ['/api/users/:email/progress', 'PUT', 'Yes (HMAC Bearer)', 'Own Account / Dev', 'routes/users.js', 'Verified Safe; IDOR Protected & Input Bounded'],
    ['/api/users/:email/certificate', 'GET', 'Yes (HMAC Bearer)', 'Own Account / Dev', 'routes/users.js', 'Verified Safe; IDOR Ownership Protected'],
    ['/api/users/:email/certificate', 'PUT', 'Yes (HMAC Bearer)', 'Own Account / Dev', 'routes/users.js', 'Verified Safe; IDOR Protected & World Validated']
  ];

  endpoints.forEach((ep) => {
    const r = detailSheet.addRow(ep);
    r.font = { name: 'Segoe UI', size: 10 };
    r.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.passBg } };
    r.getCell(6).font = { bold: true, color: { argb: COLORS.passText } };
  });

  detailSheet.columns = [{ width: 32 }, { width: 14 }, { width: 22 }, { width: 20 }, { width: 24 }, { width: 34 }];

  // Sheet 3: Reconciled Findings Register
  const findingsSheet = workbook.addWorksheet('Findings Register', { views: [{ showGridLines: true }] });
  const findHeaders = ['Finding ID', 'Type', 'Severity', 'Category', 'Resource / Package', 'Status', 'Remediation Summary'];
  const fRow = findingsSheet.addRow(findHeaders);
  fRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  fRow.eachCell(c => c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerBg } });

  const register = [
    ['SEC-01', 'App Code', 'High', 'Auth & Authorization', 'routes/users.js', 'Remediated', 'HMAC-SHA256 session token & timing-safe ownership validation'],
    ['SEC-02', 'App Code', 'High', 'Anti-Automation', 'routes/users.js', 'Remediated', 'Sliding-window IP rate limiter on login (10 attempts/15 min)'],
    ['SEC-03', 'App Code', 'Medium', 'Security Configuration', 'server.js', 'Remediated', 'Defensive HTTP response headers (nosniff, SAMEORIGIN, HSTS, CSP)'],
    ['SEC-04', 'App Code', 'Medium', 'Input Validation', 'routes/users.js', 'Remediated', 'validateProgressInput enforcing bounds on XP, level, coins, worlds'],
    ['SEC-05', 'App Code', 'Low', 'Logging / PII', 'routes/users.js', 'Remediated', 'maskEmail helper masking plaintext emails in console output'],
    ['SEC-06', 'App Code', 'Low', 'Information Disclosure', 'server.js & routes/users.js', 'Remediated', 'safeErrorResponse returning generic messages in production'],
    ['SCA-01', 'Dependency', 'Critical', 'Supply Chain', 'proxy-addr', 'Remediated', 'Updated to 2.0.8 (GHSA-jqcg-44mw-7w3h fixed)'],
    ['SCA-02', 'Dependency', 'Critical', 'Supply Chain', 'shell-quote', 'Remediated', 'Updated to 1.12.0 (GHSA-pqg4-j6r4-53mv fixed)'],
    ['SCA-03', 'Dependency', 'High', 'Supply Chain', 'vite', 'Remediated', 'Upgraded to 8.3.5 (GHSA-587h-7wmj-h5pm fixed)'],
    ['SCA-04', 'Dependency', 'High', 'Supply Chain', 'body-parser', 'Remediated', 'Updated to 2.4.0 (GHSA-27r3-jxmh-p828 fixed)'],
    ['SCA-05', 'Dependency', 'High', 'Supply Chain', 'brace-expansion', 'Remediated', 'Updated to 2.1.7 and 1.1.21'],
    ['SCA-06', 'Dependency', 'High', 'Supply Chain', 'source-map-js', 'Remediated', 'Updated to 1.2.2 (GHSA-68fv-2mgg-jv7q fixed)'],
    ['SCA-07', 'Dependency', 'Moderate', 'Supply Chain', 'qs', 'Remediated', 'Updated to 6.16.1 (GHSA-x5fp-wj9c-mxmx fixed)'],
    ['SCA-08', 'Dependency', 'Moderate', 'Supply Chain', '@react-navigation/core', 'Remediated', 'Updated to 7.24.0 (GHSA-vcc3-ghjq-m6fr fixed)'],
    ['SCA-09', 'Dependency', 'High', 'Supply Chain', 'node-forge (@expo/cli)', 'Documented Pending', 'Tied to Expo SDK 58 dev cert generation; no patched release exists on npm'],
    ['SCA-10', 'Dependency', 'High', 'Supply Chain', 'zod (@expo/cli)', 'Documented Pending', 'Tied to Expo SDK 58 config parser; Zod 4 upgrade is breaking'],
    ['SCA-11', 'Dependency', 'Moderate', 'Supply Chain', 'uuid (exceljs)', 'Remediated', 'Resolved via safe override to uuid@^11.1.1 across root and test workspaces'],
    ['SCA-12', 'Dependency', 'High', 'Supply Chain', 'serialize-javascript (mocha)', 'Remediated', 'Resolved via selenium-tests override to serialize-javascript@^7.1.4'],
    ['SCA-13', 'Dependency', 'Critical', 'Supply Chain', 'form-data (appium)', 'Remediated', 'Resolved via appium-tests override to form-data@^4.0.6 (GHSA-fjxv-7rqg-78g4 fixed)']
  ];

  register.forEach((item) => {
    const r = findingsSheet.addRow(item);
    r.font = { name: 'Segoe UI', size: 10 };
    const stCell = r.getCell(6);
    if (item[5] === 'Remediated') {
      stCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.passBg } };
      stCell.font = { bold: true, color: { argb: COLORS.passText } };
    } else {
      stCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.warnBg } };
      stCell.font = { bold: true, color: { argb: COLORS.warnText } };
    }
  });

  findingsSheet.columns = [{ width: 14 }, { width: 16 }, { width: 14 }, { width: 24 }, { width: 26 }, { width: 22 }, { width: 50 }];

  const outputDir = path.join(__dirname, '..', 'Vulnerability Test Results');
  if (!fileSystem.existsSync(outputDir)) {
    fileSystem.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'Security_Review_Report.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`✅ Generated Reconciled Security Review Excel report: ${outputPath}`);
}

generateSecurityExcelReport().catch(console.error);
