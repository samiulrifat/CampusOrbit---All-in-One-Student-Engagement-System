const Poll = require('../models/Poll');

exports.createPoll = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Invalid user, please login' });
    }

    const { clubId } = req.params;
    const { question, options, expiresAt } = req.body;
    const creatorId = req.user.userId; // get from token

    if (!creatorId || !question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Invalid poll payload' });
    }

    const poll = new Poll({
      clubId,
      creatorId,
      question,
      options: options.map(o => ({ text: o, votes: [] })),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    await poll.save();
    return res.status(201).json({ message: 'Poll created', poll });
  } catch (err) {
    console.error('createPoll error:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
};

exports.getPollsByClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const polls = await Poll.find({ clubId }).sort({ createdAt: -1 });
    return res.json(polls);
  } catch (err) {
    console.error('getPollsByClub error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.vote = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { optionIndex } = req.body;
    const userId = req.user && req.user.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    const opt = poll.options[optionIndex];
    if (!opt) return res.status(400).json({ error: 'Invalid option' });

    if (poll.options.some(o => o.votes.map(String).includes(String(userId)))) {
      return res.status(400).json({ error: 'Already voted' });
    }

    opt.votes.push(userId);
    await poll.save();
    return res.json({ message: 'Vote recorded', poll });
  } catch (err) {
    console.error('vote error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};