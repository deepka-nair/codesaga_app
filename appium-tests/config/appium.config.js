/**
 * Appium Capabilities & Server Configuration for CodeSaga Mobile App
 * File: appium-tests/config/appium.config.js
 */

export const APPIUM_SERVER_CONFIG = {
  hostname: process.env.APPIUM_HOST || '127.0.0.1',
  port: parseInt(process.env.APPIUM_PORT || '4723', 10),
  path: '/',
  logLevel: 'info'
};

export const ANDROID_CAPABILITIES = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android Emulator',
  'appium:platformVersion': '14.0',
  'appium:app': process.env.ANDROID_APP_PATH || './builds/CodeSaga-v1.0.apk',
  'appium:appPackage': 'com.codesaga.app',
  'appium:appActivity': '.MainActivity',
  'appium:autoGrantPermissions': true,
  'appium:newCommandTimeout': 300,
  'appium:ensureWebviewsHavePages': true,
  'appium:nativeWebScreenshot': true
};

export const IOS_CAPABILITIES = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': 'iPhone 15 Pro',
  'appium:platformVersion': '17.2',
  'appium:app': process.env.IOS_APP_PATH || './builds/CodeSaga-v1.0.app',
  'appium:bundleId': 'com.codesaga.app',
  'appium:autoAcceptAlerts': true,
  'appium:newCommandTimeout': 300
};
