const User = require("../models/user");

const getAllUsersController = async (req, res) => {
  try {
    const { role } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select("username email role isInstructor instructorRequest notifications");

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log("admin getAllUsers error", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const getInstructorRequestsController = async (req, res) => {
  try {
    const users = await User.find({
      "instructorRequest.status": "pending",
    }).select("username email isInstructor instructorRequest");

    res.status(200).json({
      success: true,
      message: "Instructor requests fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log("admin getInstructorRequests error", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const approveInstructorRequestController = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isInstructor = true;
    user.role = user.role === "admin" ? "admin" : "instructor";
    user.instructorRequest = {
      status: "approved",
      message: user.instructorRequest?.message || "",
      requestedAt: user.instructorRequest?.requestedAt || new Date(),
      respondedAt: new Date(),
    };

    user.notifications = user.notifications || [];
    user.notifications.push({
      message: "Your instructor request has been approved! You can now teach on the platform.",
      read: false,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Instructor request approved",
      data: user,
    });
  } catch (error) {
    console.log("admin approve request error", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const rejectInstructorRequestController = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.instructorRequest = {
      status: "rejected",
      message: user.instructorRequest?.message || "",
      requestedAt: user.instructorRequest?.requestedAt || new Date(),
      respondedAt: new Date(),
    };

    user.notifications = user.notifications || [];
    user.notifications.push({
      message: "Your instructor request was rejected. You can try again later.",
      read: false,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Instructor request rejected",
      data: user,
    });
  } catch (error) {
    console.log("admin reject request error", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = {
  getAllUsersController,
  getInstructorRequestsController,
  approveInstructorRequestController,
  rejectInstructorRequestController,
};
