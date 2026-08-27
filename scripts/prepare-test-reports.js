import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const reports = [
  { src: path.join(rootDir, 'selenium-tests', 'Login_Test_Cases_Report.xlsx'), destName: '1_Selenium_Web_E2E_Test_Report.xlsx' },
  { src: path.join(rootDir, 'appium-tests', 'Appium_Test_Cases_Report.xlsx'), destName: '2_Appium_Mobile_E2E_Test_Report.xlsx' },
  { src: path.join(rootDir, 'load-tests', 'Baseline_Load_Test_Report.xlsx'), destName: '3_API_Baseline_Load_Test_Report.xlsx' },
  { src: path.join(rootDir, 'Vulnerability Test Results', 'Security_Review_Report.xlsx'), destName: '4_DevSecOps_Security_Review_Report.xlsx' }
];

const targetDir = path.join(rootDir, 'test-reports');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log("📋 Collecting all 4 Excel test reports into test-reports/...");

let count = 0;
for (const item of reports) {
  if (fs.existsSync(item.src)) {
    const dest = path.join(targetDir, item.destName);
    fs.copyFileSync(item.src, dest);
    console.log(`  ✅ Copied: ${path.basename(item.src)} -> test-reports/${item.destName}`);
    count++;
  } else {
    console.warn(`  ⚠️ Missing report file: ${item.src}`);
  }
}

console.log(`🎉 Successfully bundled ${count}/4 Excel test reports in ${targetDir}`);
