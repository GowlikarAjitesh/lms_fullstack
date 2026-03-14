const express = require('express');
const { registerController, loginController } = require('../controllers/auth-controller');
const AuthMiddleware = require('../middleware/auth-middleware');
const User = require('../models/user');
const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);

router.get('/check-auth', AuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log('Auth is verified');
    res.status(200).json({
      success: true,
      message: 'Authentication Successful',
      data: user,
    });
  } catch (error) {
    console.error('check-auth error', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
});

module.exports = router;