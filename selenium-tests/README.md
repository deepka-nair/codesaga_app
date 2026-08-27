# CodeSaga Selenium E2E Automation & Test Management Suite

This directory contains the End-to-End (E2E) Selenium WebDriver test suite and automated test reporting system for the **CodeSaga** web frontend.

---

## 📁 Directory Architecture

```
selenium-tests/
├── tests/
│   └── login-tests.js               # Main Selenium WebDriver E2E test suite (Mocha/Chai + POM)
├── scripts/
│   └── generate-excel-report.js     # Script to generate 310+ test case report Excel file
├── Login_Test_Cases_Report.xlsx     # Generated Executive & Detailed Test Report (310 Test Cases)
├── package.json                     # Suite dependencies (selenium-webdriver, exceljs, mocha)
└── README.md                        # Documentation and execution guide
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd selenium-tests
npm install
```

### 2. Run E2E Selenium Tests
Ensure your web dev server is running on `http://localhost:5173`:
```bash
npm test
```

### 3. Generate 300+ Test Cases Excel Report
To generate or update the `Login_Test_Cases_Report.xlsx` file containing executive summary dashboard and 310 detailed test cases:
```bash
npm run generate-report
```

---

## 📊 Report Structure

The generated `Login_Test_Cases_Report.xlsx` contains 2 worksheets:

1. **Executive Summary**:
   - High-level test suite KPIs & metrics
   - Pass Rate %, Total Test Cases (310), Passed, Failed, Blocked counts
   - Category-wise Test Case Breakdown
   - Environment and execution metadata

2. **Test Details (310 Test Cases)**:
   - Covers 11 distinct test modules (`TC_LOG_001` through `TC_LOG_310`)
   - Includes Test ID, Category, Title, Pre-conditions, Steps, Test Data, Expected Result, Actual Result, Status, Priority, Severity, Mode, Script Reference, Notes.
   - Colored status banners (Green = Pass, Red = Fail, Amber = Blocked, Grey = Untested)
