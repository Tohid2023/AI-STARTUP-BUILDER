const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { createStartup, getStartups, generateNames, deleteStartup, toggleSaveStartup, regenerateStartup } = require("../controllers/startupController");

router.post("/generate-names", protect, generateNames);
router.post("/create", protect, createStartup);
router.get("/my", protect, getStartups);
router.delete("/:id", protect, deleteStartup);
router.patch("/:id/save", protect, toggleSaveStartup);
router.post("/:id/regenerate", protect, regenerateStartup);

module.exports = router;