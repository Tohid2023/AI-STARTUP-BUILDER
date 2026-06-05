const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    enum: ["BLOCK_USER", "UNBLOCK_USER", "DELETE_USER", "DELETE_IDEA"],
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  targetModel: {
    type: String,
    enum: ["User", "Startup"],
    required: true,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
}, { timestamps: true });

// Production Indexes for audit searches
adminLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AdminLog", adminLogSchema);
