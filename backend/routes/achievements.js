const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const { verifyToken, requireOfficer, isClubMember } = require('../middleware/auth');

// Get all achievements for a club
router.get('/:clubId', verifyToken, isClubMember, async (req, res) => {
  try {
    const achievements = await Achievement.find({ clubId: req.params.clubId });
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch achievements.' });
  }
});

// Create a new achievement (officers/admin only)
router.post('/:clubId', verifyToken, requireOfficer, async (req, res) => {
  try {
    const { title, description, iconUrl, criteria } = req.body;
    const achievement = new Achievement({
      clubId: req.params.clubId,
      title,
      description,
      iconUrl,
      criteria
    });
    await achievement.save();
    res.status(201).json(achievement);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create achievement.' });
  }
});

// Award an achievement to a user (officers/admin only)
router.post('/award/:clubId', verifyToken, requireOfficer, async (req, res) => {
  try {
    const { achievementId, userId } = req.body;
    if (!achievementId || !userId) {
      return res.status(400).json({ message: 'achievementId and userId are required.' });
    }

    // Check if already awarded
    const existing = await UserAchievement.findOne({ userId, achievementId, clubId: req.params.clubId });
    if (existing) {
      return res.status(400).json({ message: 'Achievement already awarded to this user.' });
    }

    const userAchievement = new UserAchievement({
      userId,
      achievementId,
      clubId: req.params.clubId
    });

    await userAchievement.save();
    res.status(201).json(userAchievement);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to award achievement.' });
  }
});

// Get all achievements earned by a user in a club
router.get('/user/:clubId/:userId', verifyToken, async (req, res) => {
  try {
    const userAchievements = await UserAchievement.find({
      userId: req.params.userId,
      clubId: req.params.clubId
    }).populate('achievementId');
    
    res.json(userAchievements);

  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user achievements.' });
  }
});

module.exports = router;
