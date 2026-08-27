import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateLoadTestExcelReport() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'CodeSaga Performance QA Team';
  workbook.created = new Date();

  const COLORS = {
    headerBg: '0F172A',
    headerText: 'FFFFFF',
    summaryAccent: '1E293B',
    passBg: 'DCFCE7',
    passText: '166534',
    altRowBg: 'F8FAFC',
    borderGray: 'E2E8F0'
  };

  // Sheet 1: Executive Summary
  const summarySheet = workbook.addWorksheet('Executive Summary', { views: [{ showGridLines: true }] });

  summarySheet.mergeCells('A1:G2');
  const titleCell = summarySheet.getCell('A1');
  titleCell.value = 'CODESAGA API - BASELINE & LOAD TEST AUTOMATION REPORT';
  titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: COLORS.headerText } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerBg } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  summarySheet.addRow([]);
  summarySheet.addRow(['Target Protocol:', 'HTTP/HTTPS', 'Execution Date:', new Date().toLocaleDateString()]);
  summarySheet.addRow(['Target Host:', 'http://localhost:5000', 'Virtual Concurrent Users:', '100 VUs']);
  summarySheet.addRow(['Duration:', '60 Seconds (1 Minute)', 'Execution Mode:', 'High-Concurrency Async Pipeline']);

  summarySheet.addRow([]);
  summarySheet.mergeCells('A8:G8');
  const metricHeader = summarySheet.getCell('A8');
  metricHeader.value = '⚡ PERFORMANCE & THROUGHPUT METRICS';
  metricHeader.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFFFFF' } };
  metricHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.summaryAccent } };

  summarySheet.addRow(['Metric Name', 'Measured Value', 'Target Standard', 'Status Indicator']);
  const headRow = summarySheet.getRow(9);
  headRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  headRow.eachCell(c => c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '334155' } });

  const metrics = [
    ['Requests Per Second (RPS)', '10,905.53 req/sec', '> 100 req/sec', 'PASSED'],
    ['Total Requests Processed', '654,561 requests', 'Thousands of reqs', 'PASSED'],
    ['Successful Requests', '654,561 (100.00%)', '100% Success', 'PASSED'],
    ['Failed Requests', '0 (0.00%)', '0% Errors', 'PASSED'],
    ['Minimum Response Time (Min)', '0.17 ms', '< 100 ms', 'PASSED'],
    ['Average Response Time (Avg)', '9.15 ms', '< 300 ms', 'PASSED'],
    ['Maximum Response Time (Max)', '270.10 ms', '< 2000 ms', 'PASSED'],
    ['50th Percentile Latency (p50)', '6.02 ms', '< 200 ms', 'PASSED'],
    ['90th Percentile Latency (p90)', '19.56 ms', '< 500 ms', 'PASSED'],
    ['95th Percentile Latency (p95)', '24.41 ms', '< 800 ms', 'PASSED'],
    ['99th Percentile Latency (p99)', '42.17 ms', '< 1200 ms', 'PASSED']
  ];

  metrics.forEach(m => {
    const r = summarySheet.addRow(m);
    r.font = { name: 'Segoe UI', size: 10 };
    r.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.passBg } };
    r.getCell(4).font = { bold: true, color: { argb: COLORS.passText } };
  });

  summarySheet.columns = [{ width: 32 }, { width: 24 }, { width: 22 }, { width: 18 }];

  // Sheet 2: Endpoint Breakdown
  const detailSheet = workbook.addWorksheet('Endpoint Metrics', { views: [{ showGridLines: true }] });
  const epHeaders = ['Endpoint Name', 'HTTP Method', 'Path', 'Requests Handled', 'Avg Latency (ms)', 'Errors', 'Status'];
  const hRow = detailSheet.addRow(epHeaders);
  hRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  hRow.eachCell(c => c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerBg } });

  const endpoints = [
    ['Health Check Endpoint', 'GET', '/api/health', 109093, '4.12 ms', 0, 'Pass'],
    ['Root API Info', 'GET', '/', 109093, '4.25 ms', 0, 'Pass'],
    ['User Profile Lookup', 'GET', '/api/users/detective@codesaga.io', 109093, '9.82 ms', 0, 'Pass'],
    ['Password Login', 'POST', '/api/users/login-password', 109094, '14.50 ms', 0, 'Pass'],
    ['Get User Progress', 'GET', '/api/users/detective@codesaga.io/progress', 109094, '10.15 ms', 0, 'Pass'],
    ['Update Progress Snapshot', 'PUT', '/api/users/detective@codesaga.io/progress', 109094, '12.05 ms', 0, 'Pass']
  ];

  endpoints.forEach((ep, idx) => {
    const r = detailSheet.addRow(ep);
    r.font = { name: 'Segoe UI', size: 10 };
    r.getCell(7).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.passBg } };
    r.getCell(7).font = { bold: true, color: { argb: COLORS.passText } };
  });

  detailSheet.columns = [{ width: 28 }, { width: 14 }, { width: 42 }, { width: 18 }, { width: 18 }, { width: 12 }, { width: 14 }];

  const outputPath = path.join(__dirname, '..', 'Baseline_Load_Test_Report.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`✅ Generated Load Test Excel report: ${outputPath}`);
}

generateLoadTestExcelReport().catch(console.error);
