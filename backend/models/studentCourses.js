const mongoose = require("mongoose");
const StudentCourseSchema = new mongoose.Schema({
  userId: String,
  course: [
    {
      courseId: String,
      title: String,
      instructorId: String,
      insturctorName: String,
      dateOfPurchase: Date,
      courseImage: String,
    },
  ],
});

module.exports = mongoose.model('studentCourses', StudentCourseSchema);
