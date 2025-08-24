const express = require("express");
const router = express.Router({ mergeParams: true });
const { verifyToken, requireOfficer, isClubMember } = require("../middleware/auth");
const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} = require("../controllers/announcementController");

// GET all announcements for a club - members only
router.get("/:clubId", verifyToken, isClubMember, getAnnouncements);

// POST a new announcement - officers/admins only
router.post("/:clubId", verifyToken, requireOfficer, createAnnouncement);

// DELETE an announcement - officers/admins only
router.delete("/:clubId/:annId", verifyToken, requireOfficer, deleteAnnouncement);

module.exports = router;