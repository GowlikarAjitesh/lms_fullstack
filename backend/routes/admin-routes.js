const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const {
  getAllUsersController,
  getInstructorRequestsController,
  approveInstructorRequestController,
  rejectInstructorRequestController,
} = require("../controllers/admin-controller");

const router = express.Router();

// Protect all admin routes
router.use(authMiddleware, adminMiddleware);

router.get("/users", getAllUsersController);
router.get("/instructor-requests", getInstructorRequestsController);
router.post("/instructor-requests/:userId/approve", approveInstructorRequestController);
router.post("/instructor-requests/:userId/reject", rejectInstructorRequestController);

module.exports = router;
