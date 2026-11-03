import { strict as assert } from 'node:assert';
import { remote } from 'webdriverio';
import { APPIUM_SERVER_CONFIG, ANDROID_CAPABILITIES } from '../config/appium.config.js';
import { generateAppiumReportFromResults } from '../scripts/generate-excel-report.js';
import { enterWebView, waitForAppForeground, displayed as visible } from './webview.js';
import { scenarios } from './scenario-register.js';

export const executionResults = [];
const live = process.env.RUN_LIVE_APPIUM === 'true';

describe('CodeSaga mobile register (310 scenarios; implementation status reported separately)', function () {
  this.timeout(180000);
  let driver;
  let setupError;
  const displayed = (id) => visible(driver, id);
  const click = async (id) => (await displayed(id)).click();
  const actions = {
    1: async () => { await displayed('btn-guest-play'); await displayed('input-email'); },
    2: async () => {
      await driver.switchContext('NATIVE_APP');
      await driver.background(2); await driver.activateApp('com.codesaga.app');
      await waitForAppForeground(driver);
      assert.equal(await driver.getCurrentPackage(), 'com.codesaga.app'); await enterWebView(driver); await displayed('input-email');
    },
    36: async () => { await click('btn-guest-play'); await displayed('dashboard-title'); },
    37: async () => {
      // Allow the asynchronous AsyncStorage write to finish; verify by relaunching the app.
      assert.equal(await driver.execute(() => JSON.parse(localStorage.getItem('codesaga-storage')).state.isGuest), true);
      await driver.switchContext('NATIVE_APP');
      await driver.pause(1000);
      await driver.terminateApp('com.codesaga.app'); await driver.activateApp('com.codesaga.app');
      await enterWebView(driver); await displayed('dashboard-title');
    },
    38: async () => { await click('open-profile'); await displayed('profile-title'); },
    39: async () => { await driver.back(); await displayed('dashboard-title'); },
    40: async () => { await click('btn-logout'); await displayed('input-email'); },
    41: async () => {
      await (await displayed('input-email')).setValue('invalid-email');
      assert.equal(await driver.execute(() => document.querySelector('[data-testid="input-email"]').validity.valid), false);
      assert.match(await driver.getUrl(), /\/login/);
    },
    42: async () => {
      const input = await displayed('input-email'); await input.setValue('qa@example.com');
      assert.equal(await input.getValue(), 'qa@example.com');
    },
    76: async () => {
      await click('btn-guest-play'); await displayed('dashboard-title');
      await (await driver.$('[data-testid="quest-card-backend"]')).scrollIntoView();
      await displayed('quest-card-backend');
    }
  };
  before(async function () {
    if (!live) return;
    try {
      driver = await remote({ ...APPIUM_SERVER_CONFIG, capabilities: ANDROID_CAPABILITIES });
      await enterWebView(driver);
    } catch (error) { setupError = error; throw error; }
  });
  afterEach(function () {
    const scenario = scenarios.find(s => this.currentTest.title.startsWith(s.id));
    executionResults.push({ ...scenario,
      status: !scenario.implemented ? 'Not Implemented' : !live ? 'Blocked' :
        this.currentTest.state === 'passed' ? 'Pass' : this.currentTest.state === 'failed' ? 'Fail' : 'Skipped',
      actual: this.currentTest.err?.message || (!scenario.implemented ? 'No automated assertion exists.' :
        !live ? 'RUN_LIVE_APPIUM is disabled; no device execution attempted.' : 'Assertions completed on Android emulator.') });
  });
  after(async function () {
    try { if (driver) await driver.deleteSession(); }
    finally {
      const results = scenarios.map(s => executionResults.find(r => r.id === s.id) || { ...s,
        status: s.implemented ? 'Blocked' : 'Not Implemented',
        actual: setupError ? `Appium setup failed: ${setupError.message}` : 'No execution result recorded.' });
      await generateAppiumReportFromResults(results);
    }
  });
  for (const scenario of scenarios) {
    it(`${scenario.id}: ${scenario.title}`, async function () {
      if (!scenario.implemented || !live) { this.skip(); return; }
      assert.ok(driver?.sessionId, 'A live Appium session is required');
      await actions[scenario.number]();
    });
  }
});
