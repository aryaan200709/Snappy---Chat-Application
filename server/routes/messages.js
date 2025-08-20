const {
  addMessage,
  getMessages,
  markMessagesAsRead,
  getUnreadCounts,
} = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/mark-read", markMessagesAsRead);
router.get("/unread-counts/:userId", getUnreadCounts);

module.exports = router;
