const express = require('express');
const passport = require('passport');
const {
  getAllNotifications,
  getNotificationById,
  readNonMessageNotifications,
  readMessageNotifications,
  getMyNotifications,
  readGroupMessageNotifications,
} = require('../controllers/notification/notificationController');
const { isAuthenticated } = require('../controllers/auth/authHelper');

const router = express.Router();

/**
 * @route GET /api/notification/
 * @desc get all notifications
 * @access private
 */
router.get('/', isAuthenticated, getAllNotifications);

/**
 * @route GET /api/notification/getmynotifications
 * @desc get mine
 * @access private
 */
router.get('/getmynotifications', isAuthenticated, getMyNotifications);

/**
 * @route GET /api/notification/:id
 * @desc get post by id
 * @access private
 */
router.get('/:id', isAuthenticated, getNotificationById);

/**
 * @route POST /api/notification/readnonmessagenotifications
 * @desc read all notifications
 * @access private
 */
router.post(
  '/readnonmessage',
  isAuthenticated,
  readNonMessageNotifications,
);

/**
 * @route POST /api/notification/readgroupmessage/:id
 * @desc read group message
 * @access private
 */
router.post(
  '/readgroupmessage/:id',
  isAuthenticated,
  readGroupMessageNotifications,
);

/**
 * @route POST /api/notification/readmessage/:id
 * @desc read messsage notifications
 * @access private
 */
router.post('/readmessage/:id', isAuthenticated, readMessageNotifications);

module.exports = router;
