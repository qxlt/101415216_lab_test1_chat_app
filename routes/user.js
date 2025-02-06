const express = require("express");
const User = require("../models/User");

const router = express.Router();


router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (password == user.password)) {
    res.status(200).json({ message: "Login successful", username });
  } else {
    res.status(400).json({ error: "Something went wrong" });
  }
});

module.exports = router;
