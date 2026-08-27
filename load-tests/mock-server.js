/**
 * Dedicated Load-Test Target Server for CodeSaga API Baseline Testing
 * File: load-tests/mock-server.js
 */

import http from 'http';

const PORT = 5000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    const url = req.url || '/';

    if (url === '/api/health') {
      res.statusCode = 200;
      return res.end(JSON.stringify({
        status: 'ok',
        message: 'CodeSaga Backend Server is running',
        mongodbConnected: true
      }));
    }

    if (url === '/') {
      res.statusCode = 200;
      return res.end(JSON.stringify({
        app: 'CodeSaga API Server',
        version: '1.0.0'
      }));
    }

    if (url.startsWith('/api/users/login-password')) {
      res.statusCode = 200;
      return res.end(JSON.stringify({
        success: true,
        exists: true,
        user: { userId: 'USR_DETECTIVE', username: 'DetectiveAria', email: 'detective@codesaga.io', role: 'user' }
      }));
    }

    if (url.includes('/progress')) {
      res.statusCode = 200;
      return res.end(JSON.stringify({
        success: true,
        progress: { xp: 250, level: 3, streak: 5, currentWorld: 'sql' }
      }));
    }

    if (url.startsWith('/api/users/')) {
      res.statusCode = 200;
      return res.end(JSON.stringify({
        success: true,
        exists: true,
        hasPassword: true,
        user: { userId: 'USR_DETECTIVE', username: 'DetectiveAria', email: 'detective@codesaga.io', role: 'user' }
      }));
    }

    res.statusCode = 404;
    return res.end(JSON.stringify({ success: false, message: 'Route not found' }));
  });
});

server.listen(PORT, () => {
  console.log(`🚀 CodeSaga Baseline Target Server listening on http://localhost:${PORT}`);
});
