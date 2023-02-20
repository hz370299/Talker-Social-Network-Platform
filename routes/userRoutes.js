const express = require('express');
const passport = require('passport');
const multer = require('multer');
const userController = require('../controllers/user/userController');
const profileSchema = require('../controllers/validation/profile');
const validate = require('../controllers/validation/helper');
const { isAuthenticated } = require('../controllers/auth/authHelper');
const upload = require('../config/upload');
const {
  changePassword,
  deactivateAccount,
  activateAccount,
} = require('../controllers/auth/loginController');

const cpUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'backgroundImg', maxCount: 1 },
]);

const router = express.Router();

/**
 * @route GET /api/user
 * @desc get All users
 * @access private
 */
router.get('/', isAuthenticated, userController.getAllUsers);
/**
 * @route GET /api/user/getInfo
 * @desc get current info of authenticated user
 * @access private
 */
router.get('/getinfo', isAuthenticated, userController.getInfo);

/**
 * @route GET /api/user/:id
 * @desc get user by id
 * @access private
 */
router.get('/:id', isAuthenticated, userController.getUserById);

/**
 * @route POST /api/user/changepassword
 * @desc change password
 * @access private
 */
router.post('/changepassword', isAuthenticated, changePassword);

/**
 * @route POST /api/user/deactivate
 * @desc deactivate account
 * @access private
 */
router.post('/deactivate', isAuthenticated, deactivateAccount);

/**
 * @route POST /api/user/update
 * @desc update profile
 * @access private
 */
router.post(
  '/update',
  isAuthenticated,
  cpUpload,
  validate(profileSchema),
  userController.cloudinaryUpload,
  userController.updateProfile,
);

/**
 * @route POST /api/user/online
 * @desc online user
 * @access private
 */
router.post('/online', isAuthenticated, userController.online);

/**
 * @route POST /api/user/offline
 * @desc user offline
 * @access private
 */
router.post('/offline', isAuthenticated, userController.offline);

/**
 * @route POST /api/user/activate/:id
 * @desc activate account
 * @access public
 */
router.post('/activate/:id', activateAccount);

module.exports = router;
