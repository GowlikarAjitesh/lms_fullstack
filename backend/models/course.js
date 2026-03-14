const mongoose = require("mongoose");
const LectureSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  freePreview: Boolean,
  public_id: String,
});
const CourseSchema = new mongoose.Schema(
  {
    instructor: {
      instructorId: String,
      instructorName: String,
      instructorEmail: String,
    },
    date: Date,
    title: String,
    category: String,
    level: String,
    primaryLanguage: String,
    subtitle: String,
    description: String,
    pricing: Number,
    objectives: String,
    welcomeMessage: String,
    image: String,
    tags: [String],
    students: [
      {
        studentId: String,
        studentName: String,
        studentEmail: String,
        paidAmount: String,
      },
    ],
    curriculum: [LectureSchema],
    isPublished: Boolean,
  },
  { timestamps: true },
);

module.exports = mongoose.model("course", CourseSchema);
