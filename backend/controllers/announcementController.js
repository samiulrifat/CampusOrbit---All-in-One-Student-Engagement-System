const Announcement = require("../models/Announcement");
const Club = require("../models/Club");

// Create announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { clubId } = req.params;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: "Club not found" });

    const announcement = new Announcement({
      clubId,
      title,
      content,
      author: req.user.userId,
    });

    await announcement.save();
    const announcements = await Announcement.find({ clubId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(201).json({ message: "Announcement posted", announcements });
  } catch (err) {
    console.error("Error creating announcement:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get announcements for a club
exports.getAnnouncements = async (req, res) => {
  try {
    const { clubId } = req.params;

    const announcements = await Announcement.find({ clubId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (err) {
    console.error("Error fetching announcements:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { clubId, annId } = req.params;

    const announcement = await Announcement.findById(annId);
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });

    if (announcement.clubId.toString() !== clubId) {
      return res.status(403).json({ message: "Announcement does not belong to this club" });
    }

    await Announcement.findByIdAndDelete(annId);

    const announcements = await Announcement.find({ clubId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json({ message: "Announcement deleted", announcements });
  } catch (err) {
    console.error("Error deleting announcement:", err);
    res.status(500).json({ message: "Server error" });
  }
};
