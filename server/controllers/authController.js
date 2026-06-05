const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered", user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    if (user.isDeleted) {
      return res.status(400).json({ message: "Account has been deleted" });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: "Account has been blocked" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", token, user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (user.isDeleted) {
      return res.status(401).json({ message: "User account has been deleted" });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: "User account has been blocked" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      if (!req.body.currentPassword) {
        return res.status(400).json({ message: "Current password is required to set a new password." });
      }

      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect." });
      }

      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setupAdmin = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    let user = await User.findOne({ email: "admin@gmail.com" });
    if (user) {
      user.role = "admin";
      user.isBlocked = false;
      user.isDeleted = false;
      user.password = hashedPassword;
      await user.save();
    } else {
      user = await User.create({
        name: "Tohid admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
        isBlocked: false,
        isDeleted: false
      });
    }
    res.status(200).json({ 
      success: true, 
      message: "Admin user setup completed. Email: admin@gmail.com, Password: admin123" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};