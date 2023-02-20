const express = require('express');

const router = express.Router();
const passport = require('passport');
const {
  isUserExisting,
  createFriendRequest,
  replyFriendRequest,
  createGroupInviteRequest,
  replyGroupInviteRequest,
  addAdministratorRequest,
  cancelAdministratorRequest,
  joinGroupRequest,
  replyGroupRequest,
  isFriendRequestType,
  isCreatorOrAdmins,
  isNotificationExisting,
  isGroupInviteType,
  isNotificationTarget,
  isGroupExisting,
  isCreator,
  isInGroup,
  isJoinGroupType,
} = require('../controllers/request/request');
const { isAuthenticated } = require('../controllers/auth/authHelper');

/**
 * @route POST /api/request/friendrequest/:id
 * @desc add friend
 * @access private
 */
router.post(
  '/friendrequest/:id',
  isAuthenticated,
  isUserExisting,
  createFriendRequest,
);

/**
 * @route POST /api/request/replyfriendrequest/:id
 * @desc reply friend request
 * @access private
 */
router.post(
  '/replyfriendrequest/:id',
  isAuthenticated,
  isNotificationExisting,
  isFriendRequestType,
  isNotificationTarget,
  replyFriendRequest,
);

/**
 * @route POST /api/request/groupinvite/:id
 * @desc invite users to the group
 * @access private
 */
router.post(
  '/groupinvite/:id',
  isAuthenticated,
  isGroupExisting,
  isCreatorOrAdmins,
  createGroupInviteRequest,
);

/**
 * @route POST /api/request/replygroupinvite/:id
 * @desc reply group invite
 * @access private
 */
router.post(
  '/replygroupinvite/:id',
  isAuthenticated,
  isNotificationExisting,
  isGroupInviteType,
  isNotificationTarget,
  replyGroupInviteRequest,
);

/**
 * @route POST /api/request/addadmin/:id
 * @desc promote user to be admin
 * @access private
 */
router.post(
  '/addadmin/:id',
  isAuthenticated,
  isGroupExisting,
  isCreator,
  addAdministratorRequest,
);

/**
 * @route POST /api/request/canceladmin
 * @desc cancel the admin role of user
 * @access private
 */
router.post(
  '/canceladmin/:id',
  isAuthenticated,
  isGroupExisting,
  isCreator,
  cancelAdministratorRequest,
);

/**
 * @route POST /api/request/joingroup/:id
 * @desc join group by id
 * @access private
 */
router.post(
  '/joingroup/:id',
  isAuthenticated,
  isGroupExisting,
  joinGroupRequest,
);

/**
 * @route POST /api/request/replygrouprequest/:id
 * @desc reply join group request
 * @access private
 */
router.post(
  '/replygrouprequest/:id',
  isAuthenticated,
  isNotificationExisting,
  isJoinGroupType,
  isNotificationTarget,
  replyGroupRequest,
);

module.exports = router;
