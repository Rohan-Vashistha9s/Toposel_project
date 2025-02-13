const User = require("../../backend/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
 
// Register User
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, fullName, gender, dateOfBirth, country } = req.body;

    // Server-side validation
    console.log(req.body);2
    if (!username || !email || !password || !fullName || !gender || !dateOfBirth || !country) {
        return res.status(400).json({ message: "All fields are required" });
      }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, email, password, fullName, gender, dateOfBirth, country });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!password || (!username && !email)) {
      return res.status(400).json({ message: "Please provide username/email and password" });
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user || !(await user.isPasswordMatch(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error });
  }
};

// Search User
exports.searchUser = async (req, res) => {
  try {
    const { query } = req.query;

    const users = await User.find({
      $or: [{ username: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }],
    });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error searching user", error });
  }
};

