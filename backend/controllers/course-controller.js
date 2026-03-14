const Course = require('../models/course');
const CourseProgress = require('../models/courseProgress');

const validateCourseBeforePublish = (courseDetails) => {
  if (!courseDetails || !Array.isArray(courseDetails.curriculum)) return false;

  // Required basic course metadata (same as AddNewCoursePage validation)
  const hasRequiredMetadata =
    typeof courseDetails.title === "string" &&
    courseDetails.title.trim().length > 0 &&
    typeof courseDetails.description === "string" &&
    courseDetails.description.trim().length > 0 &&
    typeof courseDetails.category === "string" &&
    courseDetails.category.trim().length > 0 &&
    typeof courseDetails.level === "string" &&
    courseDetails.level.trim().length > 0 &&
    (typeof courseDetails.pricing === "number" || typeof courseDetails.pricing === "string") &&
    String(courseDetails.pricing).trim().length > 0 &&
    typeof courseDetails.image === "string" &&
    courseDetails.image.trim().length > 0 &&
    typeof courseDetails.welcomeMessage === "string" &&
    courseDetails.welcomeMessage.trim().length > 0 &&
    typeof courseDetails.objectives === "string" &&
    courseDetails.objectives.trim().length > 0;

  if (!hasRequiredMetadata) return false;

  // A course must have at least one lecture with title + video URL + freePreview to publish
  const hasValidLecture = courseDetails.curriculum.some(
    (lecture) =>
      lecture &&
      typeof lecture.title === "string" &&
      lecture.title.trim().length > 0 &&
      typeof lecture.videoUrl === "string" &&
      lecture.videoUrl.trim().length > 0 &&
      lecture.freePreview === true
  );

  return hasValidLecture;
};

const createNewCourseController = async (req, res) => {
    try {
        const courseDetails = req.body;
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: 'Course Details are Incorrect'
            })
        }

        if (courseDetails.isPublished) {
          const canPublish = validateCourseBeforePublish(courseDetails);
          if (!canPublish) {
            return res.status(400).json({
              success: false,
              message:
                'Cannot publish course without at least one lecture with a title and video.',
            });
          }
        }

        const newlyCreatedCourse = await Course.create({
            ...courseDetails, 
            pricing: Number(req.body.pricing),
        });
        if(!newlyCreatedCourse){
            return res.status(400).json({
                success: false,
                message: 'Course creation Failed'
            })
        }
        res.status(201).json({
            success: true,
            message: 'Course Created Successfully',
            data: newlyCreatedCourse
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}


const getSingleCourseController = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                success: false,
                message: 'Invalid Details'
            })
        }

        const courseDetails = await Course.findById(id);
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: 'Course details cannot be retrieved'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Course details retrieved successfully',
            data: courseDetails
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const getAlloursesController = async (req, res) => {
    try {
        // Only return courses created by this instructor
        const instructorId = req.user?.id;
        const allCoursesList = await Course.find({ "instructor.instructorId": instructorId });
        if(!allCoursesList){
            return res.status(400).json({
                success: false,
                message: 'Courses cannot be retrieved'
            })
        }

        // Add analytics info per course
        const courseAnalytics = await Promise.all(
          allCoursesList.map(async (course) => {
            const progressDocs = await CourseProgress.find({ courseId: String(course._id) });

            const totalStudents = progressDocs.length;
            const completedCount = progressDocs.filter((doc) => doc.completed).length;
            const completionRate = totalStudents ? Math.round((completedCount / totalStudents) * 100) : 0;

            const completionDurations = progressDocs
              .filter((doc) => doc.completed && doc.completionDate)
              .map((doc) => {
                const startDate = doc.lecturesProgress
                  ?.filter((l) => l.viewedDate)
                  .reduce((min, l) => {
                    const date = new Date(l.viewedDate);
                    if (!min || date < min) return date;
                    return min;
                  }, null);

                if (!startDate) return null;

                const durationMs = new Date(doc.completionDate) - startDate;
                return durationMs > 0 ? durationMs : null;
              })
              .filter(Boolean);

            const avgCompletionMs =
              completionDurations.length > 0
                ? completionDurations.reduce((sum, v) => sum + v, 0) / completionDurations.length
                : null;

            const avgCompletionHours = avgCompletionMs ? Number((avgCompletionMs / 1000 / 60 / 60).toFixed(1)) : null;

            return {
              ...course.toObject(),
              analytics: {
                totalStudents,
                completionRate,
                avgCompletionHours,
              },
            };
          }),
        );

        res.status(200).json({
            success: true,
            message: 'Courses retrieved successfully',
            data: courseAnalytics
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const updateCourseController = async (req, res) => {
    try {
        const {id} = req.params;

        if(!id){
            return res.status(400).json({
                success: false,
                message: 'Invalid Details'
            })
        }
        const courseDetails = req.body;
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: 'Course Details are Incorrect'
            })
        }

        if (courseDetails.isPublished) {
          const canPublish = validateCourseBeforePublish(courseDetails);
          if (!canPublish) {
            return res.status(400).json({
              success: false,
              message:
                'Cannot publish course without at least one lecture with a title and video.',
            });
          }
        }

        const updatedCourseDetails = await Course.findByIdAndUpdate(id, courseDetails, 
  { new: true, runValidators: true });

        if(!updatedCourseDetails){
            return res.status(400).json({
                success: false,
                message: 'Course Updation Failed'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Course Updated Successfully',
            data: updatedCourseDetails
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const togglePublishCourseController = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;

    if (typeof isPublished !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isPublished must be true or false",
      });
    }

    // Fetch the existing course for validation
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (isPublished) {
      const canPublish = validateCourseBeforePublish(existingCourse);
      if (!canPublish) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot publish course without a complete course setup (metadata + at least one lecture with video).",
        });
      }
    }

    existingCourse.isPublished = isPublished;
    const updatedCourse = await existingCourse.save();

    return res.status(200).json({
      success: true,
      message: `Course ${isPublished ? "published" : "unpublished"} successfully`,
      data: updatedCourse,
    });
  } catch (error) {
    console.log("togglePublishCourseController error = ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {createNewCourseController, getSingleCourseController, getAlloursesController, updateCourseController, togglePublishCourseController};