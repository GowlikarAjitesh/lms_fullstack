const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const instructorMiddleWare = require('../middleware/instructor-middleware');
const { createNewCourseController, getAlloursesController, getSingleCourseController, updateCourseController, togglePublishCourseController } = require('../controllers/course-controller');

const router = express.Router();

router.post('/add', authMiddleware, instructorMiddleWare, createNewCourseController);
router.get('/get', authMiddleware, instructorMiddleWare, getAlloursesController);
router.get('/get/:id', authMiddleware, instructorMiddleWare, getSingleCourseController);
router.put('/update/:id', authMiddleware, instructorMiddleWare, updateCourseController);
router.put('/:id/publish', authMiddleware, instructorMiddleWare, togglePublishCourseController);

module.exports = router;