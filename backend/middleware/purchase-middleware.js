const StudentCourse = require('../models/studentCourses');

const purchaseCheckMiddleware = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id; // assuming req.user has id from authMiddleware

    const studentBoughtCourses = await StudentCourse.findOne({
      userId: studentId,
    });

    if (!studentBoughtCourses) {
      return res.status(403).json({
        success: false,
        message: 'You have not purchased this course',
      });
    }

    const isStudentAlreadyBoughtCurrentCourse =
      studentBoughtCourses.courses.findIndex(
        (item) => item.courseId == courseId,
      ) > -1;

    if (!isStudentAlreadyBoughtCurrentCourse) {
      return res.status(403).json({
        success: false,
        message: 'You have not purchased this course',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

module.exports = purchaseCheckMiddleware;