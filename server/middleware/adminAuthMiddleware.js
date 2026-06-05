const User = require("../models/User");

const adminAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized, no token credentials found",
        data: {}
      });
    }

    // DB lookup is the source of truth
    const user = await User.findById(req.user).select("role isBlocked isDeleted");

    if (!user || user.isDeleted) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized, user account does not exist or has been deleted",
        data: {}
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied, your account has been blocked",
        data: {}
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied, administrative privileges required",
        data: {}
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      data: {}
    });
  }
};

module.exports = adminAuth;
