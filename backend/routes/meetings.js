const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Meeting = require('../models/Meeting');

// load auth module and destructure
const authExports = require('../middleware/auth');
const { verifyToken, requireOfficer, isClubMember } = authExports || {};

// safe wrapper to avoid express calling undefined.apply
function safeMiddleware(fn, name) {
  return (req, res, next) => {
    if (typeof fn !== 'function') {
      console.error(`MISSING MIDDLEWARE: ${name} (type=${typeof fn})`);
      return res.status(500).json({ error: 'Server error', message: `Missing middleware: ${name}` });
    }
    try {
      return fn(req, res, next);
    } catch (err) {
      console.error(`Error in middleware ${name}:`, err);
      return res.status(500).json({ error: 'Server error', message: `Middleware error: ${name}` });
    }
  };
}

// wrapped middleware to attach to routes
const vVerifyToken = safeMiddleware(verifyToken, 'verifyToken');
const vRequireOfficer = safeMiddleware(requireOfficer, 'requireOfficer');
const vIsClubMember = safeMiddleware(isClubMember, 'isClubMember');

// debug log — will show in server console on start
console.log('meetings route auth types ->', {
  verifyToken: typeof verifyToken,
  requireOfficer: typeof requireOfficer,
  isClubMember: typeof isClubMember,
  vVerifyToken: typeof vVerifyToken,
  vRequireOfficer: typeof vRequireOfficer,
  vIsClubMember: typeof vIsClubMember
});

// TEMP: debug route to verify reachability from frontend
router.post('/debug/:clubId', (req, res) => {
  console.log('[meetings debug] received debug POST', {
    url: req.originalUrl,
    params: req.params,
    body: req.body,
    headers: {
      authorization: req.headers.authorization ? 'present' : 'missing',
    },
    time: new Date().toISOString(),
  });
  return res.status(200).json({ ok: true, msg: 'meetings debug reached' });
});

// Create meeting (club_admin)
router.post('/:clubId', vVerifyToken, vRequireOfficer, async (req, res) => {
  // ...existing handler code...
});

// Get all meetings for a club (members can view)
router.get('/club/:clubId', vVerifyToken, vIsClubMember, async (req, res) => {
  // ...existing handler code...
});

// Get single meeting
router.get('/:meetingId', vVerifyToken, vIsClubMember, async (req, res) => {
  // ...existing handler code...
});

module.exports = router;
