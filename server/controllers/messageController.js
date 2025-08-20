const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};
module.exports.getUnreadCounts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const counts = await Messages.aggregate([
      { $match: { to: mongoose.Types.ObjectId(userId), isRead: false } },
      { $group: { _id: "$sender", count: { $sum: 1 } } },
    ]);
    res.json(counts);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
      to: to,
      isRead: false,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
module.exports.markMessagesAsRead = async (req, res, next) => {
  try {
    const { from, to } = req.body; // from = contact's id, to = current user's id
    await Messages.updateMany(
      { sender: from, to: to, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true });
  } catch (ex) {
    next(ex);
  }
};
