const adminService = require("../services/adminService");

const getRequestMeta = (req) => {
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;
  const userAgent = req.headers["user-agent"] || "";
  return { ipAddress, userAgent };
};

exports.getStats = async (req, res) => {
  try {
    const stats = await adminService.getStats();
    return res.status(200).json({
      success: true,
      data: stats,
      message: "Admin statistics retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {},
      message: error.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { page, limit, search, status } = req.query;
    const usersData = await adminService.getUsers({ page, limit, search, status });
    return res.status(200).json({
      success: true,
      data: usersData,
      message: "Users retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {},
      message: error.message,
    });
  }
};

exports.getIdeas = async (req, res) => {
  try {
    const { page, limit, createdBy, startDate, endDate } = req.query;
    const ideasData = await adminService.getIdeas({ page, limit, createdBy, startDate, endDate });
    return res.status(200).json({
      success: true,
      data: ideasData,
      message: "Startup ideas retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {},
      message: error.message,
    });
  }
};

exports.toggleBlockUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const adminId = req.user; // req.user is set by authMiddleware (protect)
    const { ipAddress, userAgent } = getRequestMeta(req);

    const updatedUser = await adminService.toggleBlockUser({
      targetUserId,
      adminId,
      ipAddress,
      userAgent,
    });

    const actionText = updatedUser.isBlocked ? "blocked" : "unblocked";

    return res.status(200).json({
      success: true,
      data: {
        userId: updatedUser._id,
        isBlocked: updatedUser.isBlocked,
      },
      message: `User has been successfully ${actionText}`,
    });
  } catch (error) {
    const statusCode = error.message.includes("protection") || error.message.includes("prevention") ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      data: {},
      message: error.message,
    });
  }
};

exports.softDeleteUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const adminId = req.user;
    const { ipAddress, userAgent } = getRequestMeta(req);

    const deletedUser = await adminService.softDeleteUser({
      targetUserId,
      adminId,
      ipAddress,
      userAgent,
    });

    return res.status(200).json({
      success: true,
      data: {
        userId: deletedUser._id,
        isDeleted: deletedUser.isDeleted,
      },
      message: "User account has been soft-deleted successfully",
    });
  } catch (error) {
    const statusCode = error.message.includes("protection") || error.message.includes("prevention") ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      data: {},
      message: error.message,
    });
  }
};

exports.softDeleteIdea = async (req, res) => {
  try {
    const ideaId = req.params.id;
    const adminId = req.user;
    const { ipAddress, userAgent } = getRequestMeta(req);

    const deletedIdea = await adminService.softDeleteIdea({
      ideaId,
      adminId,
      ipAddress,
      userAgent,
    });

    return res.status(200).json({
      success: true,
      data: {
        ideaId: deletedIdea._id,
        isDeleted: deletedIdea.isDeleted,
      },
      message: "Startup idea has been soft-deleted successfully",
    });
  } catch (error) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      data: {},
      message: error.message,
    });
  }
};
