const CourseProgress = require("../models/courseProgress");
const studentCourses = require("../models/studentCourses");
const Course = require("../models/course");
const StudentCourse = require("../models/studentCourses");

// get current course progress
const getCurrentCourseProgressController = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    console.log("From course Progress page = ", userId, courseId);
    const studentPurchasedCourses = await studentCourses.findOne({ userId });

    const isCurrentCoursePurchasedByCurrentUser =
      studentPurchasedCourses?.courses?.findIndex((item) => item.courseId) > -1;

    if (!isCurrentCoursePurchasedByCurrentUser) {
      return res.status(200).json({
        success: true,
        data: {
          isPurchased: false,
        },
        message: "You need to purchase this course to access it",
      });
    }

    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    }).populate("courseId");

    if (!currentUserCourseProgress || currentUserCourseProgress?.lecturesProgress?.length == 0) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course Not Found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "No progress found. Start watching the course.",
        data: {
          courseDetails: course,
          progress: [],
          completed: false,
          completionDate: null,
          isPurchased: true,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        courseDetails: currentUserCourseProgress?.courseId,
        progress: currentUserCourseProgress?.lecturesProgress,
        completed: currentUserCourseProgress?.completed,
        completionDate: currentUserCourseProgress?.completionDate,
        isPurchased: true,
      },
    });
  } catch (error) {
    console.log("Error = ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//mark lecture as viewed
const markCurrentCourseLectureAsViewedController = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//reset course progress

const resetCurrentCourseProgressController = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getCurrentCourseProgressController,
  markCurrentCourseLectureAsViewedController,
  resetCurrentCourseProgressController,
};
