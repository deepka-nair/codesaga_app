import { strict as assert } from 'node:assert';
import { createEmailVerification } from '../services/emailVerification.js';
import { startFixture } from '../tests/submission/fixture.mjs';
import { verifyAuthToken } from '../routes/users.js';
let passed=0;
function check(name, run) { return Promise.resolve().then(run).then(()=>{passed++;console.log(`PASS ${name}`);}); }
const f=await startFixture();
try {
  for(const endpoint of ['login','set-password','']) await check(`Anonymous ${endpoint||'registration'} cannot issue a token or change an account`,async()=>{
    const r=await f.request(`/api/users/${endpoint}`,{method:'POST',body:{email:f.ownerEmail,password:'OverwritePassword123'}});assert.equal(r.status,401);assert.equal(r.data.token,undefined);
  });
  await check('Public lookup redacts progress, certificates and credential hashes',async()=>{
    const r=await f.request(`/api/users/${f.ownerEmail}`);assert.equal(r.status,200);assert.deepEqual(r.data.user,{email:f.ownerEmail});
  });
  await check('Wrong-account session cannot reset another password',async()=>{
    const r=await f.request('/api/users/set-password',{method:'POST',token:f.otherToken,body:{email:f.ownerEmail,password:'OverwritePassword123'}});assert.equal(r.status,403);
  });
  await check('Password login still creates a valid signed session',async()=>{
    const r=await f.request('/api/users/login-password',{method:'POST',body:{email:f.ownerEmail,password:f.password}});assert.equal(r.status,200);assert.equal(verifyAuthToken(r.data.token).email,f.ownerEmail);
  });
  await check('Server verifies real random OTP; grant changes password exactly once',async()=>{
    let r=await f.request('/api/users/otp/send',{method:'POST',body:{email:f.ownerEmail}});assert.equal(r.status,200);assert.equal(r.data.code,undefined);
    r=await f.request('/api/users/otp/verify',{method:'POST',body:{email:f.ownerEmail,code:f.mailbox.get(f.ownerEmail)}});assert.equal(r.status,200);
    const body={email:f.ownerEmail,password:'ChangedPassword123',verificationToken:r.data.verificationToken};
    assert.equal((await f.request('/api/users/set-password',{method:'POST',body})).status,200);
    assert.equal((await f.request('/api/users/set-password',{method:'POST',body})).status,401);
    assert.equal((await f.request('/api/users/login-password',{method:'POST',body:{email:f.ownerEmail,password:'ChangedPassword123'}})).status,200);
  });
  await check('Verified new-user registration works without a pre-existing session',async()=>{
    const email='new-verified@codesaga.test';await f.verification.send(email);
    const proof=f.verification.verify(email,f.mailbox.get(email));
    const r=await f.request('/api/users',{method:'POST',body:{email,username:'Verified fixture',password:'FixturePassword123',verificationToken:proof.verificationToken}});
    assert.equal(r.status,201);assert.equal(verifyAuthToken(r.data.token).email,email);
  });
  await check('Ownership grants are email-bound and single-use',async()=>{
    const v=createEmailVerification({deliver:async()=>{},randomCode:()=> '123456'});await v.send('a@codesaga.test');
    const proof=v.verify('a@codesaga.test','123456');assert.equal(v.consume(proof.verificationToken,'b@codesaga.test'),false);
    assert.equal(v.consume(proof.verificationToken,'a@codesaga.test'),true);assert.equal(v.consume(proof.verificationToken,'a@codesaga.test'),false);
  });
  await check('Expired OTPs and expired ownership grants fail closed',async()=>{
    let time=0;const v=createEmailVerification({deliver:async()=>{},now:()=>time,randomCode:()=> '123456'});
    await v.send('a@codesaga.test');time=300001;assert.equal(v.verify('a@codesaga.test','123456').success,false);
    await v.send('a@codesaga.test');const p=v.verify('a@codesaga.test','123456');time+=300001;assert.equal(v.consume(p.verificationToken,'a@codesaga.test'),false);
  });
  await check('Three wrong OTP attempts invalidate the challenge',async()=>{
    const v=createEmailVerification({deliver:async()=>{},randomCode:()=> '123456'});await v.send('a@codesaga.test');
    for(let i=0;i<3;i++)assert.equal(v.verify('a@codesaga.test','999999').success,false);
    assert.equal(v.verify('a@codesaga.test','123456').success,false);
  });
  await check('Unconfigured/failed email delivery does not authorize an account',async()=>{
    const v=createEmailVerification({deliver:async()=>{throw new Error('unavailable');},randomCode:()=> '123456'});
    assert.equal((await v.send('a@codesaga.test')).status,503);assert.equal(v.verify('a@codesaga.test','123456').success,false);
  });
  // Verify actual signature corruption, independent of base64 text coincidence.
  await check('Session signature corruption is rejected',()=>assert.equal(verifyAuthToken(f.token.slice(0,-5)+'AAAAA'),null));
  console.log(`OWNERSHIP REGRESSION: ${passed} checks passed against actual production router/helpers`);
} finally { await f.close(); }
