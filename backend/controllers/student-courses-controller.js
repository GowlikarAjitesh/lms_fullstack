const StudentCourse = require('../models/studentCourses');
const Course = require('../models/course');
const CourseProgress = require('../models/courseProgress');

//This function is to get all the courses list which a student has Bought/ paid.
const getCoursesBoughtByStudentController = async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentBoughtCoursesList = await StudentCourse.findOne({ userId: studentId });
    if (!studentBoughtCoursesList) {
      return res.status(200).json({
        success: true,
        message: 'Student Courses Fetched Successfully',
        data: { courses: [] },
      });
    }

    const updatedCourses = await Promise.all(
      (studentBoughtCoursesList.courses || []).map(async (courseEntry) => {
        const [courseDoc, courseProgress] = await Promise.all([
          Course.findById(courseEntry.courseId),
          CourseProgress.findOne({
            userId: studentId,
            courseId: courseEntry.courseId,
          }),
        ]);

        const curriculumLength = courseDoc?.curriculum?.length || 0;
        const viewedCount = (courseProgress?.lecturesProgress || []).filter(
          (item) => item.viewed,
        ).length;

        const progressPercentage =
          curriculumLength > 0
            ? Math.round((viewedCount / curriculumLength) * 100)
            : 0;

        return {
          ...(courseEntry.toObject ? courseEntry.toObject() : courseEntry),
          progress: progressPercentage,
        };
      }),
    );

    res.status(200).json({
      success: true,
      message: 'Student Courses Fetched Successfully',
      data: {
        ...(studentBoughtCoursesList.toObject
          ? studentBoughtCoursesList.toObject()
          : studentBoughtCoursesList),
        courses: updatedCourses,
      },
    });
  } catch (error) {
    console.log('Error = ', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};


module.exports = {getCoursesBoughtByStudentController};