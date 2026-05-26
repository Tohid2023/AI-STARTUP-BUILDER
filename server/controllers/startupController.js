const Startup = require("../models/Startup");
const { generateStartupAI, generateNamesAI } = require("../services/aiService");
const { getMlData } = require("../services/mlServiceClient");

exports.generateNames = async (req, res) => {
  try {
    const { idea } = req.body;
    if (!idea) return res.status(400).json({ message: "Idea is required" });
    
    const names = await generateNamesAI(idea);
    res.status(200).json({ names });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStartup = async (req, res) => {
  try {
    const { title, idea } = req.body;

    // Call ML microservice first to get category, then pass it to OpenAI
    const mlData = await getMlData(idea);
    
    // Ensure we have a valid ML category string
    const mlCategory = mlData.category || "Unknown";

    const aiResponse = await generateStartupAI(idea, mlCategory);

    const startup = await Startup.create({
      title: title || "AI Generated Startup",
      idea,
      industry: aiResponse.category || mlData.category,
      createdBy: req.user,
      aiResponse,
      category: aiResponse.category || mlData.category,
      keywords: mlData.keywords,
      mlRecommendations: mlData.mlRecommendations,
      similarityMatches: mlData.similarityMatches,
    });

    res.status(201).json({
      message: "Startup + AI + ML generated successfully",
      startup,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStartups = async (req, res) => {
  try {
    const startups = await Startup.find({ createdBy: req.user });
    res.json(startups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    if (startup.createdBy.toString() !== req.user) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await startup.deleteOne();
    res.status(200).json({ id: req.params.id, message: "Startup deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleSaveStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    if (startup.createdBy.toString() !== req.user) {
      return res.status(401).json({ message: "User not authorized" });
    }

    startup.isSaved = !startup.isSaved;
    await startup.save();
    
    res.status(200).json({ isSaved: startup.isSaved, message: "Startup save state updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.regenerateStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    if (startup.createdBy.toString() !== req.user) {
      return res.status(401).json({ message: "User not authorized" });
    }

    // Call OpenAI again using the existing idea and category
    const aiResponse = await generateStartupAI(startup.idea, startup.category || "Unknown");

    // Update the database with the new AI response
    startup.aiResponse = aiResponse;
    await startup.save();

    res.status(200).json({
      message: "Startup AI regenerated successfully",
      startup,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};