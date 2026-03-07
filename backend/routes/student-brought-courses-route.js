const express = require('express');
const { getCoursesBoughtByStudentController } = require('../controllers/student-courses-controller');

const router = express.Router();


router.get('/get/:studentId', getCoursesBoughtByStudentController);

module.exports = router;