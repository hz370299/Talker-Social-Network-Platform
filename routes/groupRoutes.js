const express = require('express');

const router = express.Router();
const { isAuthenticated } = require('../controllers/auth/authHelper');
const {
  isGroupExisting,
  isUserInGroup,
  getAllGroups,
  getGroupById,
  getGroupMessages,
  sendGroupMessage,
  createPublicGroup,
  createPrivateGroup,
  isGroupOwner,
  deleteGroupById,
  groupCloudinaryUpload,
  messageCloudinaryUpload,
  getAllGroupPosts,
  getGroupPostById,
  createGroupPost,
  isGroupPostExisting,
  parseGroupFromGroupPost,
  isCreatorOrAdminOrPostOwner,
  deleteGroupPostById,
  getRecommendedGroups,
  removeUserFromGroup,
  getMyGroups,
  updateGroup,
  commentGroupPost,
  likeGroupPost,
  unlikeGroupPost,
  flagGroupPost,
  leaveGroup,
  getMoreGroupPosts,
  getMoreGroupMessages,
  reportGroupPost,
  searchGroupById,
} = require('../controllers/group/groupController');
const { postCloudinaryUpload } = require('../controllers/post/PostController');
const upload = require('../config/upload');

const { groupSchema } = require('../controllers/validation/Group');
const validate = require('../controllers/validation/helper');

const cpUpload = upload.fields([
  { name: 'imgs', maxCount: 5 },
  { name: 'videos', maxCount: 2 },
  { name: 'audios', maxCount: 1 },
]);

/**
 * @route GET /api/group/
 * @desc get all groups
 * @access public
 */
router.get('/', getAllGroups);

/**
 * @route GET /api/group/getmygroups
 * @desc get my public and private groups
 * @access private
 */
router.get('/getmygroups', isAuthenticated, getMyGroups);

/**
 * @route GET /api/group/post
 * @desc get all group posts
 * @access private
 */
router.get('/post', isAuthenticated, getAllGroupPosts);

/**
 * @route GET /api/group/post/:id
 * @desc get post by ID
 * @access private
 */
router.get('/post/:id', isAuthenticated, getGroupPostById);

/**
 * @route GET /api/group/message/:id
 * @desc get group message by group id
 * @access private
 */
router.get(
  '/message/:id',
  isAuthenticated,
  isGroupExisting,
  isUserInGroup,
  getGroupMessages,
);

/**
 * @route GET /api/group/getrecommendedgroups
 * @desc get three recommended groups
 * @access private
 */
router.get('/getrecommendedgroups', isAuthenticated, getRecommendedGroups);

/**
 * @route GET /api/group/getmoremessages/:id
 * @desc get more group messages
 * @access private
 */
router.get(
  '/getmoremessages/:id',
  isAuthenticated,
  isUserInGroup,
  getMoreGroupMessages,
);

/**
 * @route GET /api/group/getmoreposts/:id
 * @desc get more group posts
 * @access private
 */
router.get(
  '/getmoreposts/:id',
  isAuthenticated,
  isUserInGroup,
  getMoreGroupPosts,
);

/**
 * @route GET /api/group/search/:id
 * @desc Search groupByid
 * @access public
 */
router.get('/search/:id', searchGroupById);

/**
 * @route GET /api/group/:id
 * @desc get group by id
 * @access private
 */
router.get(
  '/:id',
  isAuthenticated,
  isGroupExisting,
  isUserInGroup,
  getGroupById,
);

/**
 * @route POST /api/group/update/:id
 * @desc update group profile
 * @access private
 */
router.post(
  '/update/:id',
  isAuthenticated,
  isGroupExisting,
  upload.single('avatar'),
  groupCloudinaryUpload,
  updateGroup,
);

/**
 * @route POST /api/group/leave/:id
 * @desc leave group
 * @access private
 */
router.post(
  '/leave/:id',
  isAuthenticated,
  isGroupExisting,
  isUserInGroup,
  leaveGroup,
);

/**
 * @route POST /api/group/post/:id
 * @desc create group post by Id
 * @access private
 */
router.post(
  '/post/:id',
  isAuthenticated,
  isGroupExisting,
  isUserInGroup,
  cpUpload,
  postCloudinaryUpload,
  createGroupPost,
);

/**
 * @route POST /api/group/post/comment/:id
 * @desc comment group post
 * @access private
 */
router.post('/post/comment/:id', isAuthenticated, commentGroupPost);

/**
 * @route POST /api/group/post/report/:id
 * @desc report a post
 * @access private
 */
router.post('/post/report/:id', isAuthenticated, reportGroupPost);

/**
 * @route POST /api/group/post/like/:id
 * @desc like post
 * @access private
 */
router.post('/post/like/:id', isAuthenticated, likeGroupPost);

/**
 * @route POST /api/group/post/unlike/:id
 * @desc unlike post
 * @access private
 */
router.post('/post/unlike/:id', isAuthenticated, unlikeGroupPost);

/**
 * @route POST /api/group/post/flag/:id
 * @desc flag post
 * @access private
 */
router.post('/post/flag/:id', isAuthenticated, flagGroupPost);

/**
 * @route POST /api/group/public
 * @desc create public group
 * @access private
 */
router.post(
  '/public',
  isAuthenticated,
  upload.single('avatar'),
  groupCloudinaryUpload,
  validate(groupSchema),
  createPublicGroup,
);

/**
 * @route POST /api/group/private
 * @desc create private group
 * @access private
 */
router.post(
  '/private',
  isAuthenticated,
  upload.single('avatar'),
  groupCloudinaryUpload,
  createPrivateGroup,
);

/**
 * @route POST /api/group/message/:id
 * @desc send message to group
 * @access private
 */
router.post(
  '/message/:id',
  isAuthenticated,
  isGroupExisting,
  isUserInGroup,
  upload.single('media'),
  messageCloudinaryUpload,
  sendGroupMessage,
);

/**
 * @route DELETE /api/group/post/:id
 * @desc delete group post by id
 * @access creator, admins, onwer
 */
router.delete(
  '/post/:id',
  isAuthenticated,
  isGroupPostExisting,
  parseGroupFromGroupPost,
  isCreatorOrAdminOrPostOwner,
  deleteGroupPostById,
);

/**
 * @route POST /api/group/removeuser/:id
 * @desc remove user from group
 * @access admins, creator
 */
router.post(
  '/removeuser/:id',
  isAuthenticated,
  isGroupExisting,
  removeUserFromGroup,
);

/**
 * @route DELETE /api/group/:id
 * @desc delete the group
 * @access private
 */
router.delete(
  '/:id',
  isAuthenticated,
  isGroupExisting,
  isGroupOwner,
  deleteGroupById,
);

module.exports = router;
