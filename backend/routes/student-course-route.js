const express = require('express');
const { getAllCoursesToStudentView, getSingleCourseToStudentView, checkSingleCoursePurchasedController, getCourseForProgressController } = require('../controllers/student-controller');
const authMiddleware = require('../middleware/auth-middleware');
const purchaseCheckMiddleware = require('../middleware/purchase-middleware');

const router = express.Router();

router.get('/get', authMiddleware, getAllCoursesToStudentView);
router.get('/get/:id', authMiddleware, getSingleCourseToStudentView);
router.get('/progress/get/:courseId/:studentId', authMiddleware, checkSingleCoursePurchasedController);
router.get('/progress/:id', authMiddleware, purchaseCheckMiddleware, getCourseForProgressController);

module.exports = router;