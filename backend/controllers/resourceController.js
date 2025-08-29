const Resource = require('../models/Resource');

exports.createResource = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Invalid user, please login' });
    }

    const { clubId } = req.params;
    const { title, url, description } = req.body;
    const uploaderId = req.user.userId; // take from token

    if (!uploaderId || !title || !url) return res.status(400).json({ error: 'Invalid payload' });

    const resource = new Resource({ clubId, uploaderId, title, url, description: description || '' });
    await resource.save();
    return res.status(201).json({ message: 'Resource created', resource });
  } catch (err) {
    console.error('createResource error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getResourcesByClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const resources = await Resource.find({ clubId }).sort({ createdAt: -1 });
    return res.json(resources);
  } catch (err) {
    console.error('getResourcesByClub error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};