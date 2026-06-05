const express = require("express");
const router = express.Router();

const {
  getStats,
  getUsers,
  getIdeas,
  toggleBlockUser,
  softDeleteUser,
  softDeleteIdea
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuthMiddleware");
const adminRateLimiter = require("../middleware/rateLimiter");

// Apply authentication, authorization, and rate limiting to all admin routes
router.use(protect);
router.use(adminAuth);
router.use(adminRateLimiter);

// Dashboard stats
router.get("/stats", getStats);

// User lists and management
router.get("/users", getUsers);
router.put("/user/:id/block", toggleBlockUser);
router.delete("/user/:id", softDeleteUser);

// Startup idea list and management
router.get("/ideas", getIdeas);
router.delete("/idea/:id", softDeleteIdea);

module.exports = router;
