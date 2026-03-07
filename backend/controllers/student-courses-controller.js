const StudentCourse = require('../models/studentCourses');


//This function is to get all the courses list which a student has Bought/ paid.
const getCoursesBoughtByStudentController = async(req, res) => {
    try {

        const {studentId} = req.params;

        const studentBoughtCoursesList = await StudentCourse.findOne({userId: studentId} );
        console.log(studentBoughtCoursesList);
        // if(!studentBoughtCoursesList){
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Student Courses Fetch Failed'
        //     })
        // }
        res.status(200).json({
            success: true,
            message: 'Student Courses Fetched Successfully',
            data: studentBoughtCoursesList
        })
        
    } catch (error) {
        console.log('Error = ', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
};


module.exports = {getCoursesBoughtByStudentController};