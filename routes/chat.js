const express = require("express");
const Message = require("../models/Message");

const router = express.Router();


router.get("/:room", async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
});

module.exports = router;
