import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import User from '../../models/User.js';
import router, { createAuthToken } from '../../routes/users.js';
import securityHeaders from '../../middleware/securityHeaders.js';
import { createEmailVerification } from '../../services/emailVerification.js';

export async function startFixture({ mongo = false } = {}) {
  const originalLookup = User.findOne, originalSave = User.prototype.save;
  const originalState = mongoose.connection.readyState;
  const users = new Map();
  if (mongo) await mongoose.connect(process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/codesaga_submission', { serverSelectionTimeoutMS: 10000 });
  else {
    mongoose.connection.readyState = 1;
    User.findOne = ({ email }) => { const p = Promise.resolve(users.get(email) || null); p.select = () => p; return p; };
    User.prototype.save = async function () { users.set(this.email, this); return this; };
  }
  const mailbox = new Map();
  const verification = createEmailVerification({ deliver: async (email, code) => mailbox.set(email, code) });
  const app = express(); app.use(securityHeaders); app.use(express.json());
  app.locals.emailVerification = verification; app.use('/api/users', router);
  app.get('/api/health', (_, res) => res.json({ status: 'ok', mongodbConnected: mongoose.connection.readyState === 1 }));
  const server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const password = crypto.randomBytes(24).toString('base64url') + 'Aa1';
  const suffix = crypto.randomBytes(5).toString('hex');
  const ownerEmail = `owner-${suffix}@codesaga.test`, otherEmail = `other-${suffix}@codesaga.test`;
  const digest = await bcrypt.hash(password, 12);
  for (const email of [ownerEmail, otherEmail]) {
    const user = new User({ userId: `FIXTURE_${crypto.randomUUID()}`, email, username: 'Submission fixture', role: 'user', password_hash: digest });
    await user.save();
  }
  const owner = await User.findOne({ email: ownerEmail });
  const other = await User.findOne({ email: otherEmail });
  const token = createAuthToken(owner), otherToken = createAuthToken(other);
  return { base, app, verification, mailbox, ownerEmail, otherEmail, token, otherToken, password, users,
    async request(route, { method = 'GET', token: bearer, body } = {}) {
      const start = performance.now();
      const response = await fetch(base + route, { method, headers: { 'Content-Type': 'application/json', ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}) },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.timeout(15000) });
      return { status: response.status, data: await response.json(), durationMs: performance.now() - start };
    },
    async close() {
      await new Promise(resolve => server.close(resolve));
      if (mongo) { await User.deleteMany({ email: { $in: [ownerEmail, otherEmail] } }); await mongoose.disconnect(); }
      else { User.findOne = originalLookup; User.prototype.save = originalSave; mongoose.connection.readyState = originalState; }
    }
  };
}
