import { strict as assert } from 'node:assert';
export async function waitForAppForeground(driver) {
  await driver.switchContext('NATIVE_APP');
  await driver.waitUntil(async () => (await driver.queryAppState('com.codesaga.app')) === 4 &&
    (await driver.getCurrentPackage()) === 'com.codesaga.app', {
    timeout: 30000, interval: 500, timeoutMsg: 'CodeSaga did not become the foreground app within 30 seconds'
  });
}
export async function enterWebView(driver) {
  await waitForAppForeground(driver);
  await driver.switchContext('NATIVE_APP');
  let context;
  await driver.waitUntil(async () => {
    context = (await driver.getContexts()).find(c => String(c).startsWith('WEBVIEW_'));
    return Boolean(context);
  }, { timeout: 60000, interval: 1000, timeoutMsg: 'CodeSaga WebView context did not become available' });
  await driver.switchContext(context);
  assert.match(await driver.getUrl(), /^https:\/\/appassets\.androidplatform\.net\//);
}
export async function displayed(driver, id) {
  const element = await driver.$(`[data-testid="${id}"]`);
  await element.waitForDisplayed({ timeout: 60000 });
  assert.equal(await element.isDisplayed(), true, `${id} must be visible`);
  return element;
}
