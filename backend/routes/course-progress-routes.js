const express = require('express');
const {getCurrentCourseProgressController, markCurrentCourseLectureAsViewedController, resetCurrentCourseProgressController} = require('../controllers/course-progress-controller');

const router = express.Router();

router.get('/get/:userId/:courseId', getCurrentCourseProgressController);
router.post('/mark-lecture-viewed', markCurrentCourseLectureAsViewedController);
router.post('/reset-progress', resetCurrentCourseProgressController);
module.exports = router;
