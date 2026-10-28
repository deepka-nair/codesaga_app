import ExcelJS from 'exceljs';
import path from 'path';
import fileSystem from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateExcelFromResults(testResults = []) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'CodeSaga QA Automation Team';
  workbook.created = new Date();

  // Color Palette Definitions
  const COLORS = {
    navyHeader: '1E293B',
    headerText: 'FFFFFF',
    summaryAccent: '0F172A',
    cardBg: 'F1F5F9',
    cardBorder: 'CBD5E1',
    passBg: 'DCFCE7',
    passText: '166534',
    failBg: 'FEE2E2',
    failText: '991B1B',
    blockedBg: 'FEF3C7',
    blockedText: '92400E',
    untestedBg: 'F3F4F6',
    untestedText: '4B5563',
    highPriority: 'EF4444',
    medPriority: 'F59E0B',
    lowPriority: '10B981',
    borderGray: 'E2E8F0',
    altRowBg: 'F8FAFC'
  };

  const categoriesList = [
    'Standard Password Login',
    'Field Validation & Input Boundary',
    'New Account Registration & Onboarding',
    'Email OTP & Multi-Factor Auth',
    'Password Reset & Forgot Password',
    'Guest Mode & Anonymity',
    'Security, Injection & Vulnerabilities',
    'Session & LocalStorage Persistence',
    'UI Layout, Responsive & Audio Effects',
    'Cross-Browser & Network Resilience',
    'Edge Cases, Performance & Stress'
  ];

  // Process actual execution results or record failure accurately
  const finalCases = [...testResults];
  if (finalCases.length === 0) {
    // If suite setup failed before any test could execute, record exactly the 1 hook failure that Mocha reported
    finalCases.push({
      id: 'TC_INIT_000',
      category: 'Suite Initialization',
      title: 'Initialize Selenium WebDriver and verify CodeSaga web application connection',
      preconditions: '1. Express API Backend on port 5000\n2. Vite Dev Server on port 5173\n3. Headless Chrome WebDriver',
      steps: '1. Launch Chrome Headless\n2. Navigate to application base URL\n3. Assert login page renders app title',
      data: 'http://localhost:5173',
      expected: 'CodeSaga web application loads successfully and displays title.',
      actual: 'FAILED: Suite setup hook failed before test cases could execute (e.g. net::ERR_CONNECTION_REFUSED). 0 test cases executed.',
      status: 'Fail',
      priority: 'High',
      severity: 'Critical',
      mode: 'Automated',
      scriptRef: 'login-tests.js#before',
      notes: 'Suite-level hook failure (0 tests passed, 1 hook failed).'
    });
  }

  // =========================================================================
  // SHEET 1: EXECUTIVE SUMMARY DASHBOARD
  // =========================================================================
  const summarySheet = workbook.addWorksheet('Executive Summary', {
    views: [{ showGridLines: true }]
  });

  // Title Block
  summarySheet.mergeCells('A1:H2');
  const titleCell = summarySheet.getCell('A1');
  titleCell.value = 'CODESAGA WEB FRONTEND - E2E LOGIN TEST AUTOMATION REPORT';
  titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: COLORS.headerText } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.navyHeader } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Metadata Table
  const metadata = [
    ['Application:', 'CodeSaga Web Application', 'Execution Date:', new Date().toLocaleDateString()],
    ['Module Tested:', 'Authentication, Login, OTP & Session', 'Execution Mode:', 'Selenium WebDriver (Headless Chrome)'],
    ['Total Test Cases:', finalCases.length, 'Target URL:', 'http://localhost:5173']
  ];

  summarySheet.addRow([]);
  metadata.forEach((row) => {
    const r = summarySheet.addRow(row);
    r.font = { name: 'Segoe UI', size: 10 };
    r.getCell(1).font = { bold: true };
    r.getCell(3).font = { bold: true };
  });

  summarySheet.addRow([]);

  // Summary Metrics Cards Header
  summarySheet.mergeCells('A8:H8');
  const metricHeader = summarySheet.getCell('A8');
  metricHeader.value = '📊 TEST EXECUTION METRICS OVERVIEW';
  metricHeader.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFFFFF' } };
  metricHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.summaryAccent } };
  metricHeader.alignment = { vertical: 'middle', horizontal: 'left' };

  const totalCount = finalCases.length;
  const passCount = finalCases.filter(t => t.status === 'Pass').length;
  const failCount = finalCases.filter(t => t.status === 'Fail').length;
  const blockedCount = finalCases.filter(t => t.status === 'Blocked').length;
  const untestedCount = finalCases.filter(t => t.status === 'Untested').length;
  const passRate = ((passCount / totalCount) * 100).toFixed(1) + '%';

  summarySheet.addRow(['Metric', 'Count', 'Percentage', 'Status Indicator']);
  const metricsHeaderRow = summarySheet.getRow(9);
  metricsHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  metricsHeaderRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '334155' } };
  });

  const metricsData = [
    ['Total Test Cases', totalCount, '100%', 'TOTAL SUITE'],
    ['Passed', passCount, `${((passCount/totalCount)*100).toFixed(1)}%`, 'PASSED'],
    ['Failed', failCount, `${((failCount/totalCount)*100).toFixed(1)}%`, 'FAILED'],
    ['Blocked', blockedCount, `${((blockedCount/totalCount)*100).toFixed(1)}%`, 'BLOCKED'],
    ['Untested', untestedCount, `${((untestedCount/totalCount)*100).toFixed(1)}%`, 'UNTESTED'],
    ['Overall Pass Rate', passRate, passRate, 'METRIC']
  ];

  metricsData.forEach(m => {
    const row = summarySheet.addRow(m);
    row.font = { name: 'Segoe UI', size: 10 };
    if (m[0] === 'Passed') {
      row.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.passBg } };
      row.getCell(4).font = { bold: true, color: { argb: COLORS.passText } };
    } else if (m[0] === 'Failed') {
      row.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.failBg } };
      row.getCell(4).font = { bold: true, color: { argb: COLORS.failText } };
    } else if (m[0] === 'Overall Pass Rate') {
      row.font = { bold: true };
    }
  });

  summarySheet.addRow([]);

  // Category Breakdown Table Header
  summarySheet.mergeCells('A17:H17');
  const catHeader = summarySheet.getCell('A17');
  catHeader.value = '📂 TEST SUITE CATEGORY BREAKDOWN';
  catHeader.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFFFFF' } };
  catHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.summaryAccent } };

  const catTableHead = summarySheet.addRow(['Category / Feature Area', 'Total Cases', 'Automated', 'Manual', 'Pass', 'Fail', 'Blocked', 'Pass Rate %']);
  catTableHead.font = { bold: true, color: { argb: 'FFFFFF' } };
  catTableHead.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '334155' } };
  });

  categoriesList.forEach(catName => {
    const catCases = finalCases.filter(t => t.category === catName);
    const catTotal = catCases.length;
    const catAuto = catCases.filter(t => t.mode === 'Automated').length;
    const catMan = catCases.filter(t => t.mode === 'Manual').length;
    const catPass = catCases.filter(t => t.status === 'Pass').length;
    const catFail = catCases.filter(t => t.status === 'Fail').length;
    const catBlock = catCases.filter(t => t.status === 'Blocked').length;
    const catRate = catTotal > 0 ? ((catPass / catTotal) * 100).toFixed(1) + '%' : '100%';

    const r = summarySheet.addRow([catName, catTotal, catAuto, catMan, catPass, catFail, catBlock, catRate]);
    r.font = { name: 'Segoe UI', size: 10 };
  });

  summarySheet.columns = [
    { width: 38 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 12 },
    { width: 12 },
    { width: 12 },
    { width: 16 }
  ];

  // =========================================================================
  // SHEET 2: DETAILED TEST CASES (310 TEST CASES)
  // =========================================================================
  const detailSheet = workbook.addWorksheet('Test Details', {
    views: [{ showGridLines: true, freezePane: { ySplit: 1 } }]
  });

  const headers = [
    'Test Case ID',
    'Category / Module',
    'Test Scenario / Title',
    'Pre-conditions',
    'Test Steps',
    'Test Data',
    'Expected Result',
    'Actual Result',
    'Status',
    'Priority',
    'Severity',
    'Mode',
    'Automation Script Ref',
    'Notes / Comments'
  ];

  const headerRow = detailSheet.addRow(headers);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.headerText } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.navyHeader } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: COLORS.borderGray } },
      left: { style: 'thin', color: { argb: COLORS.borderGray } },
      bottom: { style: 'medium', color: { argb: '0F172A' } },
      right: { style: 'thin', color: { argb: COLORS.borderGray } }
    };
  });

  finalCases.forEach((tc, index) => {
    const row = detailSheet.addRow([
      tc.id,
      tc.category,
      tc.title,
      tc.preconditions,
      tc.steps,
      tc.data,
      tc.expected,
      tc.actual,
      tc.status,
      tc.priority,
      tc.severity,
      tc.mode,
      tc.scriptRef,
      tc.notes
    ]);

    row.height = 42;
    const isAlt = index % 2 === 1;

    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Segoe UI', size: 9.5 };
      cell.alignment = { vertical: 'top', wrapText: true };
      
      if (isAlt) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.altRowBg } };
      }

      cell.border = {
        top: { style: 'thin', color: { argb: COLORS.borderGray } },
        left: { style: 'thin', color: { argb: COLORS.borderGray } },
        bottom: { style: 'thin', color: { argb: COLORS.borderGray } },
        right: { style: 'thin', color: { argb: COLORS.borderGray } }
      };

      if ([1, 9, 10, 11, 12].includes(colNumber)) {
        cell.alignment = { vertical: 'top', horizontal: 'center', wrapText: true };
      }

      if (colNumber === 1) {
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true };
      }

      if (colNumber === 9) {
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true };
        if (tc.status === 'Pass') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.passBg } };
          cell.font.color = { argb: COLORS.passText };
        } else if (tc.status === 'Fail') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.failBg } };
          cell.font.color = { argb: COLORS.failText };
        } else if (tc.status === 'Blocked') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.blockedBg } };
          cell.font.color = { argb: COLORS.blockedText };
        } else {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.untestedBg } };
          cell.font.color = { argb: COLORS.untestedText };
        }
      }

      if (colNumber === 10) {
        if (tc.priority === 'High') cell.font.color = { argb: COLORS.highPriority };
        else if (tc.priority === 'Medium') cell.font.color = { argb: COLORS.medPriority };
        else cell.font.color = { argb: COLORS.lowPriority };
      }
    });
  });

  detailSheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: finalCases.length + 1, column: headers.length }
  };

  detailSheet.columns = [
    { width: 14 },
    { width: 28 },
    { width: 35 },
    { width: 30 },
    { width: 35 },
    { width: 24 },
    { width: 35 },
    { width: 35 },
    { width: 12 },
    { width: 12 },
    { width: 12 },
    { width: 14 },
    { width: 25 },
    { width: 28 }
  ];

  const outputDir = path.resolve(__dirname, '..');
  const outputPath = path.join(outputDir, 'Login_Test_Cases_Report.xlsx');
  await workbook.xlsx.writeFile(outputPath);

  console.log(`✅ Successfully generated Excel report with ${finalCases.length} test cases!`);
  console.log(`📄 Saved to: ${outputPath}`);
}
