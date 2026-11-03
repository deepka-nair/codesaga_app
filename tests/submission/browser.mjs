import { strict as assert } from 'node:assert';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import express from 'express';
import path from 'node:path';
import { browserCases } from './data.mjs';
import { executeCases, saveReport } from './reporter.mjs';
const suite=process.argv[2];
let driver,server;
const metadata={scope:'500 real UI assertions across chapter routes, anonymous redirects, guest access and persisted guest state',
  target:suite==='appium-android'?'Android emulator / embedded WebView':'Headless Chrome / compiled candidate',
  limitation:'Route/property matrix. These are not 500 different user journeys and do not implement unsupported camera/biometric legacy scenarios.'};
try {
  let base;
  let goto,execute,click,wait;
  if(suite==='selenium-web') {
    const require=createRequire(new URL('../../selenium-tests/package.json',import.meta.url));
    const {Builder,By}=require('selenium-webdriver');const chrome=require('selenium-webdriver/chrome');
    driver=await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().addArguments('--headless=new','--no-sandbox','--disable-dev-shm-usage','--window-size=1280,900')).build();
    const app=express();app.use(express.static(path.resolve('dist')));app.get('/{*path}',(_,res)=>res.sendFile(path.resolve('dist/index.html')));
    server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));base=`http://127.0.0.1:${server.address().port}`;
    goto=url=>driver.get(url);execute=(fn,...args)=>driver.executeScript(fn,...args);
    wait=fn=>driver.wait(fn,15000);
    click=async id=>{const e=await driver.findElement(By.css(`[data-testid="${id}"]`));await driver.executeScript('arguments[0].scrollIntoView({block:"center"})',e);await e.click();};
  }else if(suite==='appium-android') {
    const require=createRequire(new URL('../../appium-tests/package.json',import.meta.url));
    const {remote}=await import(require.resolve('webdriverio'));
    const {APPIUM_SERVER_CONFIG,ANDROID_CAPABILITIES}=await import('../../appium-tests/config/appium.config.js');
    const {enterWebView}=await import('../../appium-tests/tests/webview.js');
    driver=await remote({...APPIUM_SERVER_CONFIG,capabilities:ANDROID_CAPABILITIES});await enterWebView(driver);
    base='https://appassets.androidplatform.net';execute=(fn,...args)=>driver.execute(fn,...args);
    // Exercise the real BrowserRouter without repeatedly reloading the APK's entire JS/assets.
    // HTTP deep-link fallback is independently exercised by the 500 deployment checks.
    goto=url=>execute(route=>{
      window.history.pushState(null,'',route);
      window.dispatchEvent(new PopStateEvent('popstate'));
    },new URL(url).pathname);
    metadata.navigation='Android uses real SPA route transitions after a real cold Appium launch; HTTP fallback is covered separately.';
    wait=fn=>driver.waitUntil(fn,{timeout:20000,interval:250});
    click=async id=>{const e=await driver.$(`[data-testid="${id}"]`);await e.scrollIntoView();await e.click();};
  }else throw new Error('Unknown browser suite');
  const text=()=>execute(()=>document.body.innerText);
  const state=()=>execute(()=>JSON.parse(localStorage.getItem('codesaga-storage'))?.state);
  const cases=browserCases.map(c=>({name:c.name,expected:c.property===0?'Anonymous session redirects to login':`Guest route contract ${c.property} for chapter ${c.chapter.id}`,run:async()=>{
    if(c.property===0){
      await goto(base+'/worlds');
      await wait(async()=>await execute(()=>Boolean(document.querySelector('[data-testid="btn-logout"]')||document.querySelector('[data-testid="input-email"]'))));
      if(await execute(()=>Boolean(document.querySelector('[data-testid="btn-logout"]')))) await click('btn-logout');
      await wait(async()=>await execute(()=>location.pathname==='/login'&&Boolean(document.querySelector('[data-testid="input-email"]'))&&!(JSON.parse(localStorage.getItem('codesaga-storage'))?.state?.isGuest)));
      await goto(base+c.path);
      await wait(async()=>await execute(()=>location.pathname==='/login'&&Boolean(document.querySelector('[data-testid="input-email"]'))));
      assert.equal(await execute(()=>location.pathname),'/login');
    }else if(c.property===1){
      await click('btn-guest-play');await wait(async()=>await execute(()=>location.pathname==='/worlds'));
      await goto(base+c.path);
      await wait(async()=>{const body=await text();return c.chapter.id>1?body.includes('GUEST PREVIEW LIMIT'):body.includes(c.chapter.missions[0].title);});
      assert.equal((await text()).includes('GUEST PREVIEW LIMIT'),c.chapter.id>1);
    }else if(c.property===2)assert.equal((await state()).isGuest,true);
    else if(c.property===3)assert.equal((await state()).user.role,'guest');
    else if(c.property===4)assert.notEqual((await state()).certificates?.certificateIssued,true);
    else if(c.property===5)assert.ok((await text()).includes(c.chapter.id>1?'CREATE ACCOUNT / LOGIN':c.chapter.missions[0].title));
    else {assert.ok((await text()).length>100);assert.equal(await execute(()=>document.documentElement.clientWidth>0),true);assert.equal((await text()).includes('DETECTIVE MODULE RECOVERED'),false);}
    return `Verified ${c.world} chapter ${c.chapter.id} property ${c.property} against rendered ${metadata.target}`;
  }}));
  await executeCases(suite,cases,metadata,async()=>{
    if(suite==='appium-android'){fs.mkdirSync('submission-reports',{recursive:true});await driver.saveScreenshot(`submission-reports/${suite}-final.png`);await driver.deleteSession();}
    else await driver.quit();
    if(server)await new Promise(r=>server.close(r));driver=null;
  });
}catch(error){
  console.error(error.stack);
  if(driver)await (suite==='appium-android'?driver.deleteSession():driver.quit()).catch(()=>{});
  if(server)server.close();
  if(!fs.existsSync(`submission-reports/${suite}/${suite}-results.json`))await saveReport(suite,browserCases.map((c,i)=>({id:`${suite}-${i+1}`,name:c.name,expected:'Browser/device setup succeeds',status:'Blocked',actual:error.message,durationMs:0})),metadata);
  process.exitCode=1;
}
