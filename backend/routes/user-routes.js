const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/auth-middleware');
const {
  userController,
  updateProfileController,
  changePasswordController,
} = require('../controllers/user-controller');
const { uploadMediaToCloudinary } = require('../helpers/cloudinary');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', authMiddleware, userController);
router.put('/update-profile', authMiddleware, updateProfileController);
router.post('/change-password', authMiddleware, changePasswordController);

router.post(
  '/upload-profile-image',
  authMiddleware,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file received',
        });
      }

      const User = require('../models/user');
      const currentUser = await User.findById(req.user.id);
      const publicId = currentUser?.profileImagePublicId || undefined;
      const result = await uploadMediaToCloudinary(req.file.path, publicId);

      const updatedUser = await require('../models/user').findByIdAndUpdate(
        req.user.id,
        {
          profileImage: result.url,
          profileImagePublicId: result.public_id,
        },
        { new: true, runValidators: true },
      );

      res.status(200).json({
        success: true,
        message: 'Profile image updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      console.error('upload-profile-image error', error);
      res.status(500).json({
        success: false,
        message: 'Something went wrong uploading profile image',
      });
    }
  },
);

module.exports = router;