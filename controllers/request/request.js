const User = require('../../models/User');
const Notification = require('../../models/Notification');
const Group = require('../../models/Group');

const isUserExisting = async (req, res, next) => {
  try {
    const { id: to } = req.params;
    const user = await User.findById(to);
    // console.log(user);
    if (!user) {
      return res.status(400).json({ message: 'user not exists' });
    }
    next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const createFriendRequest = async (req, res) => {
  try {
    const { _id: from } = req.user;
    const { id: to } = req.params;
    const notification = new Notification({
      type: 'friendRequest',
      from,
      to,
    });
    await notification.save();
    return res.json({ message: 'successfully send request' });
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const isNotificationExisting = async (req, res, next) => {
  try {
    const { id: notificationId } = req.params;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(400).json({ message: 'Notification does not exist' });
    }
    req.body.notification = notification;
    next();
  } catch (err) {
    res.status(400).json({ type: err.type, message: err.message });
  }
};
const isFriendRequestType = async (req, res, next) => {
  try {
    const { notification } = req.body;
    if (notification.type !== 'friendRequest') {
      return res
        .status(400)
        .json({ message: 'Not friend request notification' });
    }
    next();
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const isNotificationTarget = async (req, res, next) => {
  try {
    const { notification } = req.body;
    const { _id: userId } = req.user;
    if (notification.to.toString() !== userId.toString()) {
      return res
        .status(400)
        .json({ message: 'You can not reply this request' });
    }
    next();
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const replyFriendRequest = async (req, res) => {
  try {
    const { message, notification } = req.body;
    const { _id: userId } = req.user;
    const { id: notificationId } = req.params;
    if (message.toLowerCase() !== 'yes') {
      notification.status = 'rejected';
      notification.read = true;
      await notification.save();
      return res.json({ message: 'refused to become friend' });
    }
    const user1 = await User.findById(notification.from);
    const user2 = await User.findById(notification.to);
    // check if they are already friends
    if (
      user1.friends.indexOf(user2._id) !== -1
      && user2.friends.indexOf(user1._id) !== -1
    ) {
      notification.status = 'failed';
      notification.read = true;
      await notification.save();
      return res.status(400).json({ message: 'You are already friends' });
    }
    const newNotification = new Notification({
      from: user2._id,
      to: user1._id,
      type: 'successFriendRequest',
    });
    notification.status = 'success';
    user1.friends.push(user2._id);
    user2.friends.push(user1._id);
    await user1.save();
    await user2.save();
    await notification.save();
    await newNotification.save();
    return res.json({
      user: {
        id: user1._id,
        name: user1.name,
        avatar: user1.status,
        status: user1.status,
      },
    });
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const isCreatorOrAdmins = async (req, res, next) => {
  try {
    const { id: groupId } = req.params;
    const { _id: userId } = req.user;
    const group = await Group.findById(groupId);
    if (
      group.creator._id.toString() !== userId.toString()
      && group.administrators.indexOf(userId) === -1
    ) {
      return res
        .status(400)
        .json({ message: 'You are not authorized to invite' });
    }
    next();
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const isGroupExisting = async (req, res, next) => {
  try {
    const { id: groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(400).json({ message: 'Group does not exist' });
    }
    req.body.group = group;
    next();
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const isCreator = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { group } = req.body;
    if (group.creator.toString() !== userId.toString()) {
      return res.status(400).json({ message: 'Not authorized' });
    }
    next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const createGroupInviteRequest = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { _id: userId } = req.user;
    const { users, group } = req.body;
    // send group invite to each user
    users.forEach(async (user) => {
      if (
        group.creator.toString() !== user.toString()
        && group.administrators.indexOf(user) === -1
        && group.members.indexOf(user) === -1
      ) {
        await new Notification({
          from: userId,
          to: user,
          type: 'groupInvite',
          group: groupId,
        }).save();
      }
    });
    return res.json({ message: 'Invited' });
  } catch (err) {
    res.status(400).json({ type: err.type, message: err.message });
  }
};

const isGroupInviteType = async (req, res, next) => {
  try {
    const { notification } = req.body;
    if (notification.type !== 'groupInvite') {
      return res.status(400).json({ message: 'Not group invite type' });
    }
    next();
  } catch (err) {
    res.status(400).json({ type: err.type, message: err.message });
  }
};

const replyGroupInviteRequest = async (req, res) => {
  try {
    const { id: notificationId } = req.params;
    const { _id: userId } = req.user;
    const { message, notification: groupInvite } = req.body;

    // find group Invite
    const groupId = groupInvite.group;
    groupInvite.read = true;
    if (message !== 'yes') {
      groupInvite.status = 'rejected';
      await groupInvite.save();
      return res.json({ message: 'refused' });
    }
    groupInvite.status = 'success';
    await groupInvite.save();
    // check if the person already in group
    const group = await Group.findById(groupId);
    if (
      group.members.indexOf(userId) !== -1
      || group.creator.toString() === userId.toString()
      || group.administrators.indexOf(userId) !== -1
    ) {
      return res.status(400).json({ message: 'You are already in the group' });
    }
    // append the user to the group
    group.members.push(userId);
    await group.save();
    const mygroup = await Group.findById(group._id)
      .populate('creator', '_id name avatar')
      .populate('administrators', '_id name avatar')
      .populate('members', '_id name avatar');
    return res.json(mygroup);
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const addAdministratorRequest = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { target, group: curGroup } = req.body;
    const idx = curGroup.members.indexOf(target);
    if (idx >= 0) {
      const group = await Group.findById(req.params.id);
      group.members.splice(idx, 1);
      group.administrators.push(target);
      await group.save();
      // create notification to inform the user
      const notification = new Notification({
        from: userId,
        to: target,
        type: 'administratorPromotion',
        group: curGroup._id,
        status: 'success',
      });
      await notification.save();
      return res.json({ message: 'Successful promotion' });
    }
    return res.status(404).json({ message: 'User is not a member' });
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const cancelAdministratorRequest = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { target } = req.body;
    const curGroup = await Group.findById(req.params.id);
    // check if the target is admin
    const idx = curGroup.administrators.indexOf(target);
    if (idx === -1) {
      return res.status(400).json({ message: 'target is not admin' });
    }
    // remove target from admin and add it back to member
    curGroup.administrators.splice(idx, 1);
    curGroup.members.push(target);
    await curGroup.save();
    // notify the target he's removed
    const notification = new Notification({
      from: userId,
      to: target,
      type: 'cancelAdministrator',
      group: curGroup._id,
    });
    await notification.save();
    return res.json({ message: 'Successfully cancel admin' });
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const isInGroup = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { group } = req.body;
    if (
      group.members.indexOf(userId) !== -1
      || group.adminitrators.indexOf(userId) !== -1
      || group.creator === userId
    ) {
      return res.json({ message: 'You are already in the group' });
    }
    next();
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const joinGroupRequest = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id: groupId } = req.params;
    const { group } = req.body;
    // create a joinGroupRequest Notification to inform all admins and creator
    const creatorNotification = new Notification({
      from: userId,
      to: group.creator,
      type: 'joinGroup',
      group: groupId,
    });
    await creatorNotification.save();
    // notify all admins
    group.administrators.forEach(async (v) => {
      await new Notification({
        from: userId,
        to: v,
        type: 'joinGroup',
        group: groupId,
      }).save();
    });
    return res.json({ message: 'request success' });
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const isJoinGroupType = async (req, res, next) => {
  try {
    const { notification } = req.body;
    if (notification.type !== 'joinGroup') {
      return res.status(400).json({ message: 'Not join group notification' });
    }
    next();
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const replyGroupRequest = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id: notificationId } = req.params;
    const { notification, message } = req.body;
    // fing the group
    const group = await Group.findById(notification.group);
    // check admin and creator
    if (
      group.creator.toString() !== userId.toString()
      && group.administrators.indexOf(userId) === -1
    ) {
      return res.json({ message: 'You are not admins or creator' });
    }
    // check if the user is already in group
    if (
      group.creator.toString() === notification.from.toString()
      || group.administrators.indexOf(notification.from) !== -1
      || group.members.indexOf(notification.from) !== -1
    ) {
      return res.json({ message: 'The user is already in group' });
    }
    if (message.toLowerCase() !== 'yes') {
      notification.status = 'rejected';
      await notification.save();
      await new Notification({
        from: userId,
        to: notification.from,
        type: 'failJoinGroup',
        status: 'success',
        group: group._id,
      }).save();
      return res.json({ message: 'rejected' });
    }
    // push the user to member
    group.members.push(notification.from);
    await group.save();
    // notify the user success message
    await new Notification({
      from: userId,
      to: notification.from,
      type: 'successJoinGroup',
      status: 'success',
      group: group._id,
    }).save();
    // update the old notification
    notification.status = 'success';
    await notification.save();
    return res.json({ message: 'success reply' });
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

module.exports = {
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
};
