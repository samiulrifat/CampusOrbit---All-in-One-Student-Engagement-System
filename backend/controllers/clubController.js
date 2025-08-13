const Club = require('../models/Club');

// ========================
// Create a new club
// ========================
exports.createClub = async (req, res) => {
  try {
    const { name, description, profileImage } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Club name is required' });
    }

    // Check if club name is already taken
    const existing = await Club.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ error: 'A club with this name already exists' });
    }

    const club = new Club({
      name: name.trim(),
      description: description || '',
      profileImage: profileImage || '',
      creatorId: req.user.userId,
      members: [
        {
          userId: req.user.userId,
          role: 'admin'
        }
      ]
    });

    await club.save();
    res.status(201).json({ message: 'Club created successfully', club });
  } catch (error) {
    console.error('Error creating club:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========================
// Get all clubs
// ========================
exports.getClubs = async (req, res) => {
  try {
    const clubs = await Club.find().populate('members.userId', 'name email').populate('creatorId', 'name email');
    res.json(clubs);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========================
// Get a club by ID
// ========================
exports.getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate('members.userId', 'name email').populate('creatorId', 'name email');
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }
    res.json(club);
  } catch (error) {
    console.error('Error fetching club:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========================
// Update club profile
// ========================
exports.updateClubProfile = async (req, res) => {
  try {
    const { name, description, profileImage } = req.body;

    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    if (name) club.name = name.trim();
    if (description) club.description = description;
    if (profileImage) club.profileImage = profileImage;

    await club.save();
    res.json({ message: 'Club profile updated successfully', club });
  } catch (error) {
    console.error('Error updating club profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========================
// Invite a member (by email)
// ========================
exports.inviteMember = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Member email is required' });

    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    // Check if already a member
    const alreadyMember = club.members.some(m => m.userId && m.userId.email === email);
    const alreadyInvited = club.invitations.some(inv => inv.email === email);

    if (alreadyMember) {
      return res.status(400).json({ error: 'This user is already a member' });
    }
    if (alreadyInvited) {
      return res.status(400).json({ error: 'Invitation already sent to this email' });
    }

    club.invitations.push({ email });
    await club.save();

    res.json({ message: `Invitation sent to ${email}`, club });
  } catch (error) {
    console.error('Error inviting member:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========================
// Remove a member
// ========================
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    const beforeCount = club.members.length;
    club.members = club.members.filter(m => m.userId.toString() !== userId);

    if (club.members.length === beforeCount) {
      return res.status(400).json({ error: 'Member not found in club' });
    }

    await club.save();
    res.json({ message: 'Member removed', club });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========================
// Delete a club
// ========================
exports.deleteClub = async (req, res) => {
  try {
    await Club.findByIdAndDelete(req.params.id);
    res.json({ message: 'Club deleted successfully' });
  } catch (error) {
    console.error('Error deleting club:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
