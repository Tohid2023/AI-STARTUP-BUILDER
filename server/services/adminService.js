const User = require("../models/User");
const Startup = require("../models/Startup");
const AdminLog = require("../models/AdminLog");

/**
 * Retrieve aggregated platform statistics
 */
exports.getStats = async () => {
  const totalUsers = await User.countDocuments({ isDeleted: false });
  const totalIdeas = await Startup.countDocuments({ isDeleted: false });

  // Today's activity (since midnight UTC)
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const ideasToday = await Startup.countDocuments({
    createdAt: { $gte: startOfDay },
    isDeleted: false,
  });

  // Active users in the last 7 days (distinct users who generated ideas)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const activeUserIds = await Startup.distinct("createdBy", {
    createdAt: { $gte: sevenDaysAgo },
    isDeleted: false,
  });
  const activeUsers = activeUserIds.length;

  const averageIdeasPerUser = totalUsers > 0 ? parseFloat((totalIdeas / totalUsers).toFixed(2)) : 0;

  return {
    totalUsers,
    totalIdeas,
    ideasToday,
    activeUsers,
    averageIdeasPerUser,
  };
};

/**
 * Retrieve paginated, search-filtered users list (excluding deleted)
 */
exports.getUsers = async ({ page = 1, limit = 10, search = "", status = "" }) => {
  const query = { isDeleted: false };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (status === "blocked") {
    query.isBlocked = true;
  } else if (status === "active") {
    query.isBlocked = false;
  }

  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.max(1, parseInt(limit));
  const skip = (parsedPage - 1) * parsedLimit;

  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parsedLimit)
    .lean();

  const total = await User.countDocuments(query);

  return {
    users,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
  };
};

/**
 * Retrieve paginated startup ideas (excluding deleted) with user details populated
 */
exports.getIdeas = async ({ page = 1, limit = 10, createdBy = "", startDate = "", endDate = "" }) => {
  const query = { isDeleted: false };

  if (createdBy) {
    query.createdBy = createdBy;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      // Set to the end of the specified day
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.max(1, parseInt(limit));
  const skip = (parsedPage - 1) * parsedLimit;

  const ideas = await Startup.find(query)
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parsedLimit)
    .lean();

  const total = await Startup.countDocuments(query);

  return {
    ideas,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
  };
};

/**
 * Toggles the block status of a user with last admin protection
 */
exports.toggleBlockUser = async ({ targetUserId, adminId, ipAddress, userAgent }) => {
  if (targetUserId.toString() === adminId.toString()) {
    throw new Error("Self-operation prevention: You cannot block or unblock your own account.");
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser || targetUser.isDeleted) {
    throw new Error("User not found or has been deleted.");
  }

  // Last Admin Protection: If target is active admin and we want to block them
  if (targetUser.role === "admin" && !targetUser.isBlocked) {
    const activeAdmins = await User.countDocuments({
      role: "admin",
      isBlocked: false,
      isDeleted: false,
    });
    if (activeAdmins <= 1) {
      throw new Error("Last admin protection: You cannot block the only active administrator.");
    }
  }

  // Toggle state
  targetUser.isBlocked = !targetUser.isBlocked;
  await targetUser.save();

  const actionType = targetUser.isBlocked ? "BLOCK_USER" : "UNBLOCK_USER";

  // Log action
  await AdminLog.create({
    adminId,
    action: actionType,
    targetId: targetUserId,
    targetModel: "User",
    ipAddress,
    userAgent,
  });

  return targetUser;
};

/**
 * Soft deletes a user account with last admin protection
 */
exports.softDeleteUser = async ({ targetUserId, adminId, ipAddress, userAgent }) => {
  if (targetUserId.toString() === adminId.toString()) {
    throw new Error("Self-operation prevention: You cannot delete your own account.");
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser || targetUser.isDeleted) {
    throw new Error("User not found or already deleted.");
  }

  // Last Admin Protection: If target is active admin
  if (targetUser.role === "admin") {
    const activeAdmins = await User.countDocuments({
      role: "admin",
      isBlocked: false,
      isDeleted: false,
    });
    if (activeAdmins <= 1) {
      throw new Error("Last admin protection: You cannot delete the only active administrator.");
    }
  }

  targetUser.isDeleted = true;
  await targetUser.save();

  // Log action
  await AdminLog.create({
    adminId,
    action: "DELETE_USER",
    targetId: targetUserId,
    targetModel: "User",
    ipAddress,
    userAgent,
  });

  return targetUser;
};

/**
 * Soft deletes a startup idea
 */
exports.softDeleteIdea = async ({ ideaId, adminId, ipAddress, userAgent }) => {
  const startup = await Startup.findById(ideaId);
  if (!startup || startup.isDeleted) {
    throw new Error("Idea not found or already deleted.");
  }

  startup.isDeleted = true;
  await startup.save();

  // Log action
  await AdminLog.create({
    adminId,
    action: "DELETE_IDEA",
    targetId: ideaId,
    targetModel: "Startup",
    ipAddress,
    userAgent,
  });

  return startup;
};
