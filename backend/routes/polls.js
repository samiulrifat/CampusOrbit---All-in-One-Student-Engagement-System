const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');

// ✅ Create a new poll
router.post('/', async (req, res) => {
  try {
    const { clubId, creatorId, question, options } = req.body;

    if (!clubId || !creatorId || !question || !options || options.length < 2) {
      return res.status(400).json({ error: 'Please provide clubId, creatorId, question, and at least 2 options' });
    }

    const formattedOptions = options.map(opt => ({ text: opt }));

    const poll = new Poll({
      clubId,
      creatorId,
      question,
      options: formattedOptions
    });

    await poll.save();

    res.status(201).json({ message: 'Poll created', poll });
  } catch (err) {
    console.error('Error creating poll:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get all polls for a club
router.get('/:clubId', async (req, res) => {
  try {
    const { clubId } = req.params;
    const polls = await Poll.find({ clubId }).sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    console.error('Error fetching polls:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Vote for an option
router.post('/:pollId/vote', async (req, res) => {
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

// ✅ Close a poll
router.patch('/:pollId/close', async (req, res) => {
  try {
    const { pollId } = req.params;

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    poll.isOpen = false;
    await poll.save();

    res.json({ message: 'Poll closed', poll });
  } catch (err) {
    console.error('Error closing poll:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
