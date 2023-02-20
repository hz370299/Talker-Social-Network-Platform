const express = require('express');

const router = express.Router();
const upload = require('../config/upload');
const { isAuthenticated } = require('../controllers/auth/authHelper');
const {
  getAllChats,
  getMessagesByChatId,
  isFriendsOrShareGroup,
  getOrCreateChat,
  sendPrivateMessage,
  getMyChats,
  deleteChat,
  getMoreChatMessages,
} = require('../controllers/chat/chat');
const {
  messageCloudinaryUpload,
} = require('../controllers/group/groupController');

/**
 * @route GET /api/chat
 * @desc get all chats
 * @access private
 */

router.get('/', isAuthenticated, getAllChats);

/**
 * @route GET /api/chat/getmychats
 * @desc get my chats
 * @access private
 */
router.get('/getmychats', isAuthenticated, getMyChats);

/**
 * @route GET /api/chat/getorcreatechat/:id
 * @desc get chat or create chat
 * @access private
 */
router.get(
  '/getorcreatechat/:id',
  isAuthenticated,
  isFriendsOrShareGroup,
  getOrCreateChat,
);
/**
 * @route POST /api/chat/message/:id
 * @desc send private message
 * @access private
 */
router.post(
  '/message/:id',
  isAuthenticated,
  upload.single('media'),
  messageCloudinaryUpload,
  sendPrivateMessage,
);

/**
 * @route GET /api/chat/getmoremessages/:id
 * @desc get more messages
 * @access private
 */
router.get('/getmoremessages/:id', isAuthenticated, getMoreChatMessages);

/**
 * @route DELETE /api/chat/delete/:id
 * @desc delete chat by id
 * @access private
 */
router.delete('/delete/:id', isAuthenticated, deleteChat);

/**
 * @route GET /api/chat/:id
 * @desc get Chat by iD
 * @access private
 */
router.get('/:id', isAuthenticated, getMessagesByChatId);

module.exports = router;
