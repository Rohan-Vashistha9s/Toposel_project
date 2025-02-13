const express = require("express");
const { registerUser, loginUser, searchUser } = require("../../backend/controllers/userControllers.js");
const protect = require("../middlewares/auth.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/search", protect, searchUser);

module.exports = router;
