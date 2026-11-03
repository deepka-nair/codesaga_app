import fs from 'node:fs';
import { enterWebView, displayed, waitForAppForeground } from './webview.js';
import { strict as assert } from 'node:assert';
import { remote } from 'webdriverio';
import { APPIUM_SERVER_CONFIG, ANDROID_CAPABILITIES } from '../config/appium.config.js';

describe('CodeSaga Android emulator smoke tests', function () {
  this.timeout(180000);
  let driver;

  before(async function () {
    driver = await remote({
      ...APPIUM_SERVER_CONFIG,
      capabilities: {
        ...ANDROID_CAPABILITIES,
        'appium:appWaitActivity': '*',
        'appium:appWaitDuration': 30000,
        'appium:newCommandTimeout': 120
      }
    });
  });

  after(async function () {
    if (driver) await driver.deleteSession();
  });

  it('creates a real Appium session on the Android emulator', function () {
    assert.ok(driver.sessionId, 'Appium must return a live session ID');
  });

  it('launches CodeSaga in the expected Android package', async function () {
    const currentPackage = await driver.getCurrentPackage();
    assert.equal(currentPackage, 'com.codesaga.app');
  });

  it('loads a non-empty native view hierarchy', async function () {
    await enterWebView(driver);
    await displayed(driver, 'input-email');
    await driver.switchContext('NATIVE_APP');
    const source = await driver.getPageSource();
    assert.ok(typeof source === 'string' && source.length > 20, 'Android page source should contain UI hierarchy');
  });

  it('captures a real device screenshot', async function () {
    fs.mkdirSync('results', { recursive: true });
    await driver.saveScreenshot('results/android-login.png');
    const screenshot = await driver.takeScreenshot();
    assert.ok(typeof screenshot === 'string' && screenshot.length > 100, 'Screenshot must contain encoded image data');
  });

  it('survives background and foreground lifecycle transitions', async function () {
    await driver.background(2);
    await driver.activateApp('com.codesaga.app');
    await waitForAppForeground(driver);
    const currentPackage = await driver.getCurrentPackage();
    assert.equal(currentPackage, 'com.codesaga.app');
    await enterWebView(driver);
    await displayed(driver, 'input-email');
  });
});
