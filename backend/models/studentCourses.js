const mongoose = require("mongoose");
const StudentCourseSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  courses: [
    {
      courseId: String,
      title: String,
      instructorId: String,
      instructorName: String,
      dateOfPurchase: Date,
      courseImage: String,
      progress: Number,
    },
  ],
});

module.exports = mongoose.model('studentCourses', StudentCourseSchema);
