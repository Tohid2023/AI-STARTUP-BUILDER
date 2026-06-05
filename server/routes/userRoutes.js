const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, setupAdmin } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/setup-admin", setupAdmin);

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;