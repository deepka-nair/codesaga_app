# CodeSaga Appium Mobile E2E Automation & Test Management Suite

This directory contains the End-to-End (E2E) Appium mobile automation test suite and test reporting system for the **CodeSaga** mobile frontend (Android/iOS).

---

## 📁 Directory Architecture

```
appium-tests/
├── config/
│   └── appium.config.js             # Appium capabilities (Android UiAutomator2 / iOS XCUITest)
├── tests/
│   └── appium-e2e-tests.js          # Appium E2E Mobile Automation test script (POM + WebdriverIO)
├── scripts/
│   └── generate-excel-report.js     # Script to generate 310+ mobile test case report Excel file
├── Appium_Test_Cases_Report.xlsx    # Generated Executive & Detailed Mobile Test Report (310 Cases)
├── package.json                     # Suite dependencies (webdriverio, appium, exceljs, mocha)
└── README.md                        # Framework documentation and execution guide
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd appium-tests
npm install
```

### 2. Run Appium E2E Mobile Tests
Ensure an Appium 2.x server is running (`appium`) along with an Android Emulator or iOS Simulator:
```bash
npm test
```

### 3. Generate 300+ Test Cases Excel Report
To generate or update the `Appium_Test_Cases_Report.xlsx` file containing the mobile executive summary dashboard and 310 detailed test cases:
```bash
npm run generate-report
```

---

## 📊 Report Structure

The generated `Appium_Test_Cases_Report.xlsx` contains 2 worksheets:

1. **Executive Summary**:
   - Mobile test suite KPIs & metrics
   - Pass Rate %, Total Test Cases (310), Passed, Failed, Blocked counts
   - Category-wise Mobile Module Breakdown
   - Automation Engine & Target Package metadata (`com.codesaga.app`)

2. **Test Details (310 Test Cases)**:
   - Covers 11 distinct mobile modules (`TC_APP_001` through `TC_APP_310`)
   - Details: Touch Gestures, Swiping, Pinch/Zoom, Hybrid Context Switching (NATIVE vs WEBVIEW), Screen Orientation, Offline resilience, Push notifications, and Accessibility IDs.
   - Styled with custom column widths, wrap text, and color-coded status badges.
