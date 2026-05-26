const mongoose = require("mongoose");

const startupSchema = new mongoose.Schema({
  title: String,
  idea: String,
  industry: String,
  aiResponse: Object,
  category: String,
  keywords: [String],
  mlRecommendations: {
    features: [String],
    techStack: [String],
    monetization: [String]
  },
  similarityMatches: Array,
  isSaved: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

module.exports = mongoose.model("Startup", startupSchema);