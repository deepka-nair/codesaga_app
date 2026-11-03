import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import express from 'express';
import path from 'node:path';
import { missions, chapters } from './data.mjs';
import { startFixture } from './fixture.mjs';
import { executeCases, saveReport } from './reporter.mjs';
import securityHeaders from '../../middleware/securityHeaders.js';
const suite = process.argv[2];
const key = m => `${m.world}/${m.chapter.id}/${m.mission.id}`;
let cleanup = async()=>{};
let cases=[],metadata={target:'local isolated candidate',caseCountMeaning:'500 named data-driven cases; not 500 distinct product features'};
try {
  if (suite==='validation') {
    metadata.scope='Schema and answer-key checks for 500 distinct curriculum missions across all six worlds';
    cases=missions.map(m=>({name:`${key(m)} curriculum schema and answer-key validity`,expected:'Unique mission ID, readable title/story, valid rewards, hints and answer data',run:()=>{
      const v=m.mission;
      assert.equal(m.chapter.missions.filter(x=>x.id===v.id).length,1);
      assert.ok(typeof v.id==='string'&&v.id.trim());assert.ok(typeof v.title==='string'&&v.title.trim());
      assert.ok(typeof v.story==='string'&&v.story.trim());assert.ok(Array.isArray(v.hints));
      assert.ok(Number.isFinite(v.xp)&&v.xp>=0);assert.ok(Number.isFinite(v.coins)&&v.coins>=0);
      if(v.type==='code_matching'){assert.ok(v.options.length>=2);assert.ok(Number.isInteger(v.correctPair)&&v.correctPair>=0&&v.correctPair<v.options.length);}
      else if(v.options){assert.ok(v.options.length>=2);assert.ok(Number.isInteger(v.answerIndex)&&v.answerIndex>=0&&v.answerIndex<v.options.length);}
      else {assert.ok(typeof v.solution==='string'&&v.solution.trim());}
      return `${v.type}: schema, rewards and ${v.options?'answer index':'solution'} verified`;
    }}));
  } else if(suite==='deployment') {
    metadata.scope='500 HTTP readiness assertions over compiled SPA deep links; candidate preview, not production deployment';
    const app=express();app.use(securityHeaders);app.use(express.static(path.resolve('dist')));
    app.get('/{*path}',(_,res)=>res.sendFile(path.resolve('dist/index.html')));
    const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));cleanup=()=>new Promise(r=>server.close(r));
    const base=`http://127.0.0.1:${server.address().port}`;
    const checks=['GET succeeds','HTML root exists','Module entry is present','HTML doctype exists','HEAD succeeds','HTML MIME type','MIME sniffing disabled'];
    cases=chapters.flatMap(c=>checks.map((check,property)=>({name:`${c.path}: ${check}`,expected:check,run:async()=>{
      const response=await fetch(base+c.path,{method:property===4?'HEAD':'GET',signal:AbortSignal.timeout(10000)});
      const text=property===4?'':await response.text();
      if(property===0||property===4)assert.equal(response.status,200);
      if(property===1)assert.match(text,/id="root"/);
      if(property===2)assert.match(text,/<script[^>]+type="module"/);
      if(property===3)assert.match(text,/<!doctype html>/i);
      if(property===5)assert.match(response.headers.get('content-type'),/text\/html/);
      if(property===6)assert.equal(response.headers.get('x-content-type-options'),'nosniff');
      return `${response.status} ${response.headers.get('content-type')}`;
    }}))).slice(0,500);
  } else {
    const fixture=await startFixture({mongo:suite==='full-e2e'});cleanup=()=>fixture.close();
    const progress=`/api/users/${fixture.ownerEmail}/progress`, cert=`/api/users/${fixture.ownerEmail}/certificate`;
    if(suite==='unit-api') {
      metadata.scope='Actual production router over HTTP, with isolated in-memory Mongoose model fixtures';
      cases=missions.map(m=>({name:`${key(m)} owner progress API round trip`,expected:'200 save/read; mission and world persist with normalized score',run:async()=>{
        const body={xp:m.mission.xp,coins:m.mission.coins,currentWorld:m.world,completedMissions:[m.mission.id]};
        const saved=await fixture.request(progress,{method:'PUT',token:fixture.token,body});assert.equal(saved.status,200);
        const read=await fixture.request(progress,{token:fixture.token});assert.equal(read.status,200);
        assert.equal(read.data.progress.xp,m.mission.xp);assert.equal(read.data.progress.currentWorld,m.world);
        assert.deepEqual(read.data.progress.completedMissions,[m.mission.id]);return 'Saved and read the exact mission, world and score through the actual router';
      }}));
    }else if(suite==='vulnerability') {
      metadata.scope='500 real-router denial checks across curriculum progress payloads and five account-takeover/IDOR attack classes';
      const attacks=['email-only token issuance','unauthenticated password reset','existing registration password overwrite','cross-account progress write','forged session certificate read'];
      cases=missions.map((m,i)=>({name:`${key(m)} blocks ${attacks[i%5]}`,expected:i%5===3?'403 and no unauthorized mutation':'401 and no session token issued',run:async()=>{
        const type=i%5;
        const endpoints=['/api/users/login','/api/users/set-password','/api/users',progress,cert];
        const r=await fixture.request(endpoints[type],{method:type===4?'GET':type===3?'PUT':'POST',
          token:type===3?fixture.otherToken:type===4?fixture.token.slice(0,-4)+'AAAA':undefined,
          body:type===4?undefined:{email:fixture.ownerEmail,password:'AttackerPassword123',username:m.mission.id,xp:m.mission.xp,completedMissions:[m.mission.id]}});
        assert.equal(r.status,type===3?403:401);assert.equal(r.data.token,undefined);
        return `Denied with HTTP ${r.status}; no token in response`;
      }}));
    }else if(suite==='full-e2e') {
      metadata.scope='500 authenticated API-to-MongoDB journeys, not browser automation; real MongoDB service and production router';
      // Verify real ownership-grant signup/password flow against MongoDB before running journeys.
      let r=await fixture.request('/api/users/otp/send',{method:'POST',body:{email:fixture.ownerEmail}});assert.equal(r.status,200);
      r=await fixture.request('/api/users/otp/verify',{method:'POST',body:{email:fixture.ownerEmail,code:fixture.mailbox.get(fixture.ownerEmail)}});assert.equal(r.status,200);
      const set=await fixture.request('/api/users/set-password',{method:'POST',body:{email:fixture.ownerEmail,password:fixture.password,verificationToken:r.data.verificationToken}});assert.equal(set.status,200);
      cases=missions.map(m=>({name:`${key(m)} authenticated database persistence and isolation journey`,expected:'Password login, write, database-backed read, cross-account denial and unearned-certificate 404',run:async()=>{
        const login=await fixture.request('/api/users/login-password',{method:'POST',body:{email:fixture.ownerEmail,password:fixture.password}});assert.equal(login.status,200);assert.ok(login.data.token);
        const token=login.data.token;
        const save=await fixture.request(progress,{method:'PUT',token,body:{xp:m.mission.xp,currentWorld:m.world,completedMissions:[m.mission.id]}});assert.equal(save.status,200);
        const read=await fixture.request(progress,{token});assert.deepEqual(read.data.progress.completedMissions,[m.mission.id]);
        assert.equal(read.data.progress.currentWorld,m.world);
        assert.equal((await fixture.request(progress,{token:fixture.otherToken})).status,403);
        assert.equal((await fixture.request(cert,{token})).status,404);
        return 'Password authentication, real MongoDB round trip, account isolation and unearned-certificate behavior verified';
      }}));
    }else if(suite==='load') {
      metadata.scope='500 measured authenticated API requests at concurrency 25; each row is one measured request, not a separate load scenario';
      const measurements=new Array(500);let next=0;
      await Promise.all(Array.from({length:25},async()=>{while(next<500){const i=next++;try{measurements[i]=await fixture.request(progress,{token:fixture.token});}catch(error){measurements[i]={error};}}}));
      const durations=measurements.filter(r=>!r.error).map(r=>r.durationMs).sort((a,b)=>a-b);
      metadata.concurrency=25;metadata.p95Ms=Number((durations[Math.floor(durations.length*.95)]||0).toFixed(2));
      cases=missions.map((m,i)=>({measuredDurationMs:measurements[i].durationMs,name:`Request ${i+1}: ${key(m)} authenticated API latency sample`,expected:'HTTP 200, valid progress and latency below 5000 ms',run:()=>{
        const r=measurements[i];if(r.error)throw r.error;assert.equal(r.status,200);assert.equal(r.data.success,true);assert.ok(r.durationMs<5000);
        return `HTTP ${r.status}; measured ${r.durationMs.toFixed(2)} ms, concurrency 25`;
      }}));
    }else throw new Error(`Unknown suite: ${suite}`);
  }
  await executeCases(suite,cases,metadata,cleanup);
}catch(error){
  console.error(error.stack);await cleanup().catch(()=>{});
  if(!fs.existsSync(`submission-reports/${suite}/${suite}-results.json`))await saveReport(suite,Array.from({length:500},(_,i)=>({id:`${suite}-${i+1}`,name:`Unexecuted case ${i+1}`,expected:'Suite setup succeeds',status:'Blocked',actual:`Setup failed: ${error.message}`,durationMs:0})),metadata);
  process.exitCode=1;
}
