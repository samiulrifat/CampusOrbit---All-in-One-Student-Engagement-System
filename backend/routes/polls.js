const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const Club = require('../models/Club');
const { verifyToken, requireRole } = require('../middleware/auth');


// Create a new poll (only clubAdmin)
router.post('/', verifyToken, requireRole(['clubAdmin']), async (req, res) => {
  try {
    const { clubId, question, options } = req.body;
    const creatorId = req.user.userId || req.user._id;

    // Authorization check: only club creator may proceed
    const club = await Club.findById(clubId);
    if (!club || String(club.creatorId) !== String(creatorId)) {
      return res.status(403).json({ error: "Not authorized for this club." });
    }

    if (!clubId || !creatorId || !question || !options || options.length < 2) {
      return res.status(400).json({ error: 'Please provide clubId, creatorId, question, and at least 2 options' });
    }

    const poll = new Poll({
      clubId,
      creatorId,
      question,
      options
    });

    await poll.save();

    res.status(201).json({ message: 'Poll created', poll });
  } catch (err) {
    console.error('Error creating poll:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get all polls for a club (require login)
router.get('/:clubId', verifyToken, async (req, res) => {
  try {
    const { clubId } = req.params;
    const polls = await Poll.find({ clubId }).sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    console.error('Error fetching polls:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Vote for an option (require login)
router.post('/:pollId/vote', verifyToken, async (req, res) => {
  try {
    const { pollId } = req.params;
    const { optionIndex } = req.body;

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    if (!poll.isOpen) return res.status(400).json({ error: 'Poll is closed' });

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ error: 'Invalid option index' });
    }

    poll.options[optionIndex].votes += 1;
    await poll.save();

    res.json({ message: 'Vote recorded', poll });
  } catch (err) {
    console.error('Error voting on poll:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Close a poll (clubAdmin only)
router.patch('/:pollId/close', verifyToken, requireRole(['clubAdmin']), async (req, res) => {
  try {
    const { pollId } = req.params;

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    const club = await Club.findById(poll.clubId);
    if (!club || String(club.creatorId) !== String(req.user.userId)) {
      return res.status(403).json({ error: "Not authorized to close this poll." });
    }

    poll.isOpen = false;
    await poll.save();

    res.json({ message: 'Poll closed', poll });
  } catch (err) {
    console.error('Error closing poll:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;