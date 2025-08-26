const User = require('../models/User');
const Club = require('../models/Club');

// Create a club
async function createClub(req, res) {
  const { name, description, profileImage } = req.body;
  const creatorId = req.user.userId;

  try {
    const newClub = new Club({
      name,
      description,
      profileImage,
      creatorId,
      members: [{ userId: creatorId, role: 'admin' }]
    });

    await newClub.save();
    res.status(201).json({ message: 'Club created', club: newClub });
  } catch (err) {
    console.error('Error creating club:', err);
    res.status(500).json({ error: 'Server error creating club' });
  }
}

// List all clubs
async function getClubs(req, res) {
  try {
    const clubs = await Club.find({});
    res.json(clubs);
  } catch (err) {
    console.error('Error fetching clubs:', err);
    res.status(500).json({ error: 'Server error fetching clubs' });
  }
}

// Get single club
async function getClubById(req, res) {
  try {
    const club = await Club.findById(req.params.id).populate('members.userId', 'name email');
    if (!club) return res.status(404).json({ error: 'Club not found' });
    res.json(club);
  } catch (err) {
    console.error('Error fetching club:', err);
    res.status(500).json({ error: 'Server error fetching club' });
  }
}

// Update club profile
async function updateClubProfile(req, res) {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    const { name, description, profileImage } = req.body;
    if (name) club.name = name;
    if (description) club.description = description;
    if (profileImage) club.profileImage = profileImage;

    await club.save();
    res.json({ message: 'Club updated', club });
  } catch (err) {
    console.error('Error updating club:', err);
    res.status(500).json({ error: 'Server error updating club' });
  }
}

// Add member directly
async function inviteMember(req, res) {
  const clubId = req.params.id;
  const { email, role = 'member' } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const alreadyMember = club.members.some(
      m => m.userId.toString() === user._id.toString()
    );
    if (alreadyMember)
      return res.status(400).json({ error: 'User is already a member' });

    club.members.push({ userId: user._id, role });
    await club.save();

    // Update the user's clubsJoined array
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { clubsJoined: clubId }
    });

    res.json({ message: 'User added to club', club });
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ error: 'Server error adding member' });
  }
}

// Remove member
async function removeMember(req, res) {
  const clubId = req.params.id;
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    club.members = club.members.filter(m => m.userId.toString() !== userId);
    await club.save();

    // Also remove the club from user's clubsJoined array
    await User.findByIdAndUpdate(userId, {
      $pull: { clubsJoined: clubId }
    });

    res.json({ message: 'Member removed', club });
  } catch (err) {
    console.error('Error removing member:', err);
    res.status(500).json({ error: 'Server error removing member' });
  }
}

// Delete club
async function deleteClub(req, res) {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);
    if (!club) return res.status(404).json({ error: 'Club not found' });
    res.json({ message: 'Club deleted' });
  } catch (err) {
    console.error('Error deleting club:', err);
    res.status(500).json({ error: 'Server error deleting club' });
  }
}

module.exports = {
  createClub,
  getClubs,
  getClubById,
  updateClubProfile,
  inviteMember,
  removeMember,
  deleteClub
};
