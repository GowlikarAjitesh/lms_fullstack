const express = require("express");
const { getAllInstructorsController } = require("../controllers/instructor-controller");

const router = express.Router();

// Returns all users with role: instructor (public)
router.get("/", getAllInstructorsController);

module.exports = router;
