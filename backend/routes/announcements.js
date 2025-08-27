const express = require("express");
const router = express.Router({ mergeParams: true });
const { verifyToken, requireOfficer } = require("../middleware/auth");
const getUserClubs = require("../middleware/getUserClubs");
const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} = require("../controllers/announcementController");

// simple async wrapper
const asyncH = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get("/", verifyToken, asyncH(async (req, res) => {
  const ids = String(req.query.clubIds || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(String);

  if (ids.length === 0) return res.json([]);

  const announcements = await Promise.all(
    ids.map(async (cid) => {
      try {
        const list = await getAnnouncements(cid);
        return Array.isArray(list) ? list : [];
      } catch (_) {
        return [];
      }
    })
  );

  // flatten
  const merged = announcements.flat();
  return res.json(merged);
}));


router.get("/:clubId", verifyToken, getUserClubs, asyncH(async (req, res) => {
  const { clubId } = req.params;
  const memberships = Array.isArray(req.userClubs) ? req.userClubs.map(String) : [];
  if (!memberships.includes(String(clubId))) {
    return res.status(403).json({ error: "Access denied: not a member of this club" });
  }
  const announcements = await getAnnouncements(clubId);
  return res.json(announcements);
}));


router.post("/:clubId", verifyToken, requireOfficer, asyncH(createAnnouncement));

router.delete("/:clubId/:annId", verifyToken, requireOfficer, asyncH(deleteAnnouncement));

module.exports = router;
