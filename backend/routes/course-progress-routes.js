const express = require('express');
const {getCurrentCourseProgressController} = require('../controllers/course-progress-controller');

const router = express.Router();

router.get('/get/:userId/:courseId', getCurrentCourseProgressController);

module.exports = router;
