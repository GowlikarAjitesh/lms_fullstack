const CourseProgress = require("../models/courseProgress");
const studentCourses = require("../models/studentCourses");
const Course = require("../models/course");

const calculateProgressPercentage = (course, progressList = []) => {
  if (!course?.curriculum?.length) return 0;
  const viewedCount = new Set(
    progressList
      .filter((item) => item.viewed)
      .map((item) => String(item.lectureId)),
  ).size;
  return Math.round((viewedCount / course.curriculum.length) * 100);
};
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
    });

    const courseDetails = await Course.findById(courseId);
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }

    const progressList = currentUserCourseProgress?.lecturesProgress || [];
    const progressPercentage = calculateProgressPercentage(
      courseDetails,
      progressList,
    );

    if (!currentUserCourseProgress || progressList.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No progress found. Start watching the course.",
        data: {
          courseDetails,
          progress: [],
          progressPercentage,
          completed: false,
          completionDate: null,
          isPurchased: true,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: progressList,
        progressPercentage,
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
    const {userId, courseId, lectureId} = req.body;
    let progress = await CourseProgress.findOne({userId, courseId});
    

    if(!progress){
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress:[{
          lectureId, viewed:true, dateViewed: new Date()
        }]
      })
      await progress.save();
    }
    else{
      const lectureProgress = progress.lecturesProgress.find(item=>item.lectureId == lectureId);

      if(lectureProgress){
        lectureProgress.viewed = true;
        lectureProgress.dateViewed = new Date();
      }else{
        progress.lecturesProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date()
        })
      }
      
      await progress.save();
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }

    const progressPercentage = calculateProgressPercentage(
      course,
      progress.lecturesProgress,
    );

    const viewedLectureIds = new Set(
      progress.lecturesProgress
        .filter((item) => item.viewed)
        .map((item) => String(item.lectureId)),
    );

    const allLecturesViewed =
      course.curriculum.length > 0 &&
      course.curriculum.every((lec) => viewedLectureIds.has(String(lec._id)));

    if (allLecturesViewed) {
      progress.completed = true;
      progress.completionDate = new Date();
    }

    await progress.save();

    // keep the purchased course progress field in sync
    const purchasedCourses = await studentCourses.findOne({ userId });
    if (purchasedCourses) {
      const courseEntry = purchasedCourses.courses.find(
        (item) => String(item.courseId) === String(courseId),
      );
      if (courseEntry) {
        courseEntry.progress = progressPercentage;
        await purchasedCourses.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Lecture is marked as Viewed",
      data: progress,
      progressPercentage,
    });
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
    const {userId, courseId} = req.body;
    const progress = await CourseProgress.findOne({userId, courseId});
    if(!progress){
      return res.status(404).json({
        success: false,
        message: 'Progress not found'
      })
    }

    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;

    await progress.save();

    // keep the purchased course progress field in sync
    const purchasedCourses = await studentCourses.findOne({ userId });
    if (purchasedCourses) {
      const courseEntry = purchasedCourses.courses.find(
        (item) => String(item.courseId) === String(courseId),
      );
      if (courseEntry) {
        courseEntry.progress = 0;
        await purchasedCourses.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Course progress is resetted",
      data: progress,
      progressPercentage: 0,
    })
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
