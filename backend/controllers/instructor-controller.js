const User = require("../models/user");

const getAllInstructorsController = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" }).select(
      "username email bio profileImage"
    );

    res.status(200).json({
      success: true,
      message: "Instructors fetched successfully",
      data: instructors,
    });
  } catch (error) {
    console.log("getAllInstructorsController error", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getAllInstructorsController,
};
