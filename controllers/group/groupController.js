const fs = require('fs');
const Group = require('../../models/Group');
const GroupMessage = require('../../models/GroupMessage');
const cloudinary = require('../../config/cloudinary');
const GroupPost = require('../../models/GroupPost');
const User = require('../../models/User');
const Notification = require('../../models/Notification');
const Comment = require('../../models/Comment');

const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({});
    return res.json(groups);
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const getGroupById = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const group = await Group.findById(groupId)
      .populate({
        path: 'creator',
        select: '_id name avatar',
      })
      .populate({
        path: 'administrators',
        select: '_id name avatar',
      })
      .populate({
        path: 'members',
        select: '_id name avatar',
      });
    const groupMessages = await GroupMessage.find({ group: groupId })
      .populate('sender', '_id name avatar')
      .select('type sender content media _id createdAt')
      .sort({ createdAt: -1 })
      .limit(10);
    const groupPosts = await GroupPost.find({ group: groupId })
      .populate('user', '_id name avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'commenter',
          select: '_id name',
        },
      })
      .sort({ createdAt: -1 })
      .limit(5);
    return res.json({ group, messages: groupMessages, posts: groupPosts });
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const searchGroupById = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const group = await Group.findById(groupId)
      .populate({
        path: 'creator',
        select: '_id name avatar',
      })
      .populate({
        path: 'administrators',
        select: '_id name avatar',
      })
      .populate({
        path: 'members',
        select: '_id name avatar',
      });
    return res.json(group);
  } catch (err) {
    return res.status(400).json({ message: 'failed' });
  }
};

const getMoreGroupMessages = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { page = 0 } = req.query;
    const skip = 10 * page;
    const messages = await GroupMessage.find({ group: groupId })
      .populate('sender', '_id name avatar')
      .select('type sender content media _id createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);
    return res.json(messages);
  } catch (err) {
    return res.status(400).json({ message: 'Get Messages Failed' });
  }
};

const getMoreGroupPosts = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { page = 0 } = req.query;
    const skip = 5 * page;
    const posts = await GroupPost.find({ group: groupId })
      .populate('user', '_id name avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'commenter',
          select: '_id name',
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(5);
    return res.json(posts);
  } catch (err) {
    return res.status(400).json({ message: 'Get Posts Failed' });
  }
};

const getMyGroups = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const mygroups = await Group.find({
      $or: [
        { creator: userId },
        { administrators: userId },
        { members: userId },
      ],
    })
      .populate('creator', '_id name avatar')
      .populate('administrators', '_id name avatar')
      .populate('members', '_id name avatar');

    return res.json(mygroups);
  } catch (err) {
    res.status(400).json({ message: 'Get my group failed' });
  }
};

const isGroupExisting = async (req, res, next) => {
  try {
    const { id: groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.json({ message: 'group does not exist' });
    }
    next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const isUserInGroup = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { id: groupId } = req.params;
    const group = await Group.findById(groupId);
    if (
      group.creator.toString() !== userId.toString()
      && group.administrators.indexOf(userId) === -1
      && group.members.indexOf(userId) === -1
    ) {
      return res.json({ message: 'User is not in the group' });
    }
    next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const getGroupMessages = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    // get groupMessages sort by time descending
    const groupMessages = await GroupMessage.find({ group: groupId })
      .sort('-createdAt')
      .populate({
        path: 'sender',
        select: '_id name avatar',
      });
    return res.json(groupMessages);
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const sendGroupMessage = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { _id: userId } = req.user;
    // check if it's media message
    if (req.file) {
      const type = req.file.mimetype;
      const groupMessage = new GroupMessage({
        type,
        group: groupId,
        sender: userId,
        receiver: groupId,
        media: req.body.media,
      });
      await groupMessage.save();
      // broadcast notification to each group member except self
      const curGroup = await Group.findById(groupId);
      const members = [
        curGroup.creator,
        ...curGroup.administrators,
        ...curGroup.members,
      ];
      const allNotifications = [];
      for (const e of members) {
        if (e.toString() !== userId.toString()) {
          const cur = await new Notification({
            from: userId,
            to: e,
            type: 'groupMessage',
            status: 'success',
            group: groupId,
          }).save();
          allNotifications.push(cur);
        }
      }
      const cleaned = await GroupMessage.findById(groupMessage.id).populate(
        'sender',
        '_id name avatar',
      );
      return res.json({ message: cleaned, notifications: allNotifications });
    }
    // text message
    const groupMessage = new GroupMessage({
      type: 'text',
      group: groupId,
      sender: userId,
      receiver: groupId,
      content: req.body.content,
    });
    await groupMessage.save();
    // broadcast notification to each group member except self
    const curGroup = await Group.findById(groupId);
    const members = [
      curGroup.creator,
      ...curGroup.administrators,
      ...curGroup.members,
    ];
    const allNotifications = [];
    for (const e of members) {
      if (e.toString() !== userId.toString()) {
        const cur = await new Notification({
          from: userId,
          to: e,
          type: 'groupMessage',
          status: 'success',
          group: groupId,
        }).save();
        allNotifications.push(cur);
      }
    }
    const cleaned = await GroupMessage.findById(groupMessage.id).populate(
      'sender',
      '_id name avatar',
    );
    return res.json({ message: cleaned, notifications: allNotifications });
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const createPublicGroup = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const group = new Group({
      creator: userId,
      name: req.body.name,
      avatar: req.body.avatar || null,
      bio: req.body.bio,
      tags: req.body.tags || [],
    });
    await group.save();
    return res.json(group);
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const createPrivateGroup = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const group = new Group({
      creator: userId,
      type: 'private',
      name: req.body.name,
      avatar: req.body.avatar || null,
      bio: req.body.bio,
      tags: req.body.tags || [],
    });
    await group.save();
    res.json(group);
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const isGroupOwner = async (req, res, next) => {
  try {
    const { id: groupId } = req.params;
    const { _id: userId } = req.user;
    const group = await Group.findById(groupId);
    // console.log(group.creator);
    // console.log(userId);
    // console.log(group.creator === userId);
    if (group.creator.toString() !== userId.toString()) {
      return res.json({
        message: 'you are not authorized to delete the group',
      });
    }
    next();
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const deleteGroupById = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { _id: userId } = req.user;
    await Group.findByIdAndDelete(groupId);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const groupCloudinaryUpload = async (req, res, next) => {
  try {
    if (req.file) {
      const { path: avatarPath } = req.file;
      const avatarName = req.file.originalname.split('')[0];
      const response = await cloudinary.uploader.upload(avatarPath, {
        public_id: `CIS557/${avatarName}`,
      });
      const avatarUrl = response.url;
      fs.unlinkSync(avatarPath);
      req.body.avatar = avatarUrl;
    }
    next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const messageCloudinaryUpload = async (req, res, next) => {
  try {
    if (req.file) {
      const isImage = req.file.mimetype.includes('image');
      const isAudio = req.file.mimetype.includes('audio');
      const isVideo = req.file.mimetype.includes('video');
      let resourceType = 'image';
      if (isAudio) {
        resourceType = 'video';
      }
      if (isVideo) {
        resourceType = 'video';
      }
      const { path: mediaPath } = req.file;
      const mediaName = req.file.originalname.split('')[0];
      const mediaRes = await cloudinary.uploader.upload(mediaPath, {
        public_id: `CIS557/${mediaName}`,
        resource_type: resourceType,
      });

      fs.unlinkSync(mediaPath);
      req.body.media = mediaRes.url;
    }
    next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

/**
 * Group Post
 */

const getAllGroupPosts = async (req, res) => {
  try {
    const groupPosts = await GroupPost.find({});
    return res.json(groupPosts);
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const getGroupPostById = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const groupPost = await GroupPost.find({ group: groupId });
    return res.json(groupPost);
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const createGroupPost = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const group = await Group.findById(req.params.id);
    const {
      content = '', imgs = [], videos = [], audios = [],
    } = req.body;
    const groupId = group._id;
    const groupPost = new GroupPost({
      user: userId,
      group: groupId,
      content,
      imgs,
      videos,
      audios,
    });
    await groupPost.save();
    // broadcast notification to all group members
    const members = [group.creator, ...group.administrators, ...group.members];
    const exceptme = members.filter((v) => v.toString() !== userId.toString());
    for (const e of exceptme) {
      new Notification({
        from: userId,
        to: e,
        type: 'groupPost',
        status: 'success',
        group: group._id,
      }).save();
    }

    const cleaned = await GroupPost.findById(groupPost._id)
      .populate('user', '_id name avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'commenter',
          select: '_id name',
        },
      });
    return res.json(cleaned);
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const isGroupPostExisting = async (req, res, next) => {
  try {
    const { id: groupPostId } = req.params;
    const groupPost = await GroupPost.findById(groupPostId);
    if (!groupPost) {
      return res.status(400).json({ message: 'GroupPost does not exist' });
    }
    req.body.groupPost = groupPost;
    next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const parseGroupFromGroupPost = async (req, res, next) => {
  try {
    const { groupPost } = req.body;
    const group = await Group.findById(groupPost.group);
    req.body.group = group;
    next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const isCreatorOrAdminOrPostOwner = async (req, res, next) => {
  try {
    const { group, groupPost } = req.body;
    const { _id: userId } = req.user;
    if (
      group.creator.toString() !== userId.toString()
      && group.administrators.indexOf(userId) === -1
      && groupPost.user.toString() !== userId.toString()
    ) {
      return res.status(401).json({ message: 'unauthorized' });
    }
    next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const deleteGroupPostById = async (req, res) => {
  try {
    const { id: groupPostId } = req.params;
    await GroupPost.findByIdAndDelete(groupPostId);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const removeUserFromGroup = async (req, res, next) => {
  try {
    const { user: targetId } = req.body;
    const { _id: userId } = req.user;
    const { id: groupId } = req.params;
    const group = await Group.findById(groupId);
    if (userId.toString() === targetId.toString()) {
      return res.status(400).json({ message: 'You can not remove yourself' });
    }
    if (
      group.creator.toString() !== userId.toString()
      && group.administrators.indexOf(userId) === -1
    ) {
      return res
        .status(401)
        .json({ message: 'You are not authorized to delete' });
    }
    const idx = group.members.indexOf(targetId);
    if (idx === -1) {
      return res.status(400).json({ message: 'target not a member' });
    }
    group.members.splice(idx, 1);
    await group.save();
    return res.json(group);
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const getRecommendedGroups = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    // find 3 groups that user not in
    const groups = await Group.find({
      type: 'public',
      members: {
        $ne: userId,
      },
      creator: {
        $ne: userId,
      },
      administrators: {
        $ne: userId,
      },
    }).limit(3);
    return res.json(groups);
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const commentGroupPost = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id: groupPostId } = req.params;
    const { content } = req.body;
    const comment = new Comment({
      groupPost: groupPostId,
      commenter: userId,
      content,
    });
    console.log(content, groupPostId);
    await comment.save();
    const cleaned = await Comment.findById(comment._id).populate({
      path: 'commenter',
      select: '_id name',
    });
    return res.json(cleaned);
  } catch (err) {
    return res.status(400).json({ message: 'Comment failed' });
  }
};

const likeGroupPost = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id: groupPostId } = req.params;
    const groupPost = await GroupPost.findById(groupPostId);
    if (!groupPost) {
      return res.status(404).json({ message: 'Not found!' });
    }
    // check if the user already likes the post
    if (groupPost.likes.indexOf(userId) !== -1) {
      return res.json({ message: 'already liked' });
    }
    groupPost.likes.push(userId);
    await groupPost.save();
    if (userId.toString() !== groupPost.user.toString()) {
      // emit a new notification
      const notification = new Notification({
        type: 'like',
        from: userId,
        to: groupPost.user,
      });
      await notification.save();
    }
    return res.json(groupPost);
  } catch (err) {
    return res.status(400).json({ message: 'Like failed' });
  }
};

const unlikeGroupPost = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id: groupPostId } = req.params;
    const groupPost = await GroupPost.findById(groupPostId);
    if (!groupPost) {
      return res.status(404).json({ message: 'Not found!' });
    }
    // check if the user likes the post
    const idx = groupPost.likes.indexOf(userId);
    if (idx === -1) {
      return res.json({ message: 'already unliked' });
    }
    groupPost.likes.splice(idx, 1);
    await groupPost.save();
    return res.json(groupPost);
  } catch (err) {
    return res.status(400).json({ message: 'unlike failed' });
  }
};

const flagGroupPost = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id: groupPostId } = req.params;
    const groupPost = await GroupPost.findById(groupPostId);
    if (!groupPost) {
      return res.status(404).json({ message: 'Not found!' });
    }
    // check if the user flagged the post
    const idx = groupPost.flag.indexOf(userId);
    if (idx !== -1) {
      return res.json({ message: 'already flagged' });
    }
    groupPost.flag.push(userId);
    await groupPost.save();
    return res.json(groupPost);
  } catch (err) {
    return res.status(400).json({ message: 'flag faied' });
  }
};

const updateGroup = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id: groupId } = req.params;
    const {
      name, bio, tags, avatar,
    } = req.body;
    const group = await Group.findById(groupId);
    // check if the user is admin or creator
    if (
      group.creator.toString() !== userId.toString()
      && group.administrators.indexOf(userId) === -1
    ) {
      return res
        .status(401)
        .json({ message: 'You have no right to modify group profile' });
    }
    group.name = name;
    group.bio = bio;
    group.tags = tags;
    group.avatar = avatar;
    await group.save();
    // console.log(group);
    return res.json(group);
  } catch (err) {
    console.log('has error');
    res.status(400).json({ message: 'update group failed', hint: err.message });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id: groupId } = req.params;
    const group = await Group.findById(groupId);
    if (group.creator.toString() === userId.toString()) {
      await Group.findByIdAndDelete(groupId);
      return res.json({ message: 'leave and delete the group' });
    }
    const adminIdx = group.administrators.indexOf(userId);
    if (adminIdx !== -1) {
      group.administrators.splice(adminIdx, 1);
      await group.save();
      return res.json({ message: 'left' });
    }
    const memberIdx = group.members.indexOf(userId);
    if (memberIdx !== -1) {
      group.members.splice(memberIdx, 1);
      await group.save();
      return res.json({ message: 'left' });
    }
  } catch (err) {
    return res.status(400).json({ message: 'leave faied' });
  }
};

const reportGroupPost = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id: groupPostId } = req.params;
    const groupPost = await GroupPost.findById(groupPostId);
    // check if the user already reported
    if (groupPost.flag.indexOf(userId) !== -1) {
      return res.status(400).json({ message: 'Already reported' });
    }
    groupPost.flag.push(userId);
    await groupPost.save();
    return res.json({ messages: 'reported' });
  } catch (err) {
    return res.status(400).json({ message: 'remove failed' });
  }
};

module.exports = {
  getAllGroups,
  getGroupById,
  getGroupMessages,
  sendGroupMessage,
  isGroupExisting,
  isUserInGroup,
  isGroupOwner,
  createPublicGroup,
  createPrivateGroup,
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
};
