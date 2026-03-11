const CourseProgress = require('../models/courseProgress');
const studentCourses = require('../models/studentCourses');
const Course = requrie('../models/course');
const StudentCourse = require('../models/studentCourses');

// get current course progress
const getCurrentCourseProgressController = async(req, res) => {
    try {
        const {userId, courseId} = req.params;
        const studentPurchasedCourses = await studentCourses.findOne({userId});
        const isCurrentCoursePurchasedByCurrentUser = studentPurchasedCourses?.courses?.findIndex(item => item.courseId) > -1;

        if(!isCurrentCoursePurchasedByCurrentUser){
            return res.status(200).json({
                success: false,
                isPurchased: false,
                message: 'You need to purchase this course to access it'
            })
        }

        const currentUserCourseProgress = await CourseProgress.findOne({userId, courseId}).populate('courseId');

        if(currentUserCourseProgress?.lecturesProgress?.length == 0){
            const course = await Course.findById(courseId);
            if(!course){
                return res.status(404).json({
                    success: false,
                    message: 'Course Not Found'
                })
            }

            return res.status(200).json({
                success: true,
                message: 'No progress found, you can start watching the course',
                data: {
                    courseDetails: course,
                    progress: [],
                    isPurchased: true
                }
            })
        }

        res.status(200).json({
            success: true,
            data: {
                courseDetails: currentUserCourseProgress.courseId,
                progress: currentUserCourseProgress.lecturesProgress,
                
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

//mark lecture as viewed
const markCurrentCourseLectureAsViewedController = async(req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

//reset course progress

const resetCurrentCourseProgressController = async(req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}


module.exports = {getCurrentCourseProgressController, markCurrentCourseLectureAsViewedController, resetCurrentCourseProgressController};