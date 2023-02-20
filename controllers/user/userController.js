const fs = require('fs');
const User = require('../../models/User');
const cloudinary = require('../../config/cloudinary');
const Group = require('../../models/Group');
const Post = require('../../models/Post');

const getAllUsers = async (_req, res) => {
  try {
    const result = await User.find()
      .populate('notifications')
      .populate('posts');
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ status: 'fail', data: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.findById({ _id: id }, [
      '_id',
      'name',
      'avatar',
      'bio',
      'backgroundImg',
    ]);
    const posts = await Post.find({ user: id })
      .sort('-createdAt')
      .populate({
        path: 'comments',
        select: 'content createdAt post',
        populate: {
          path: 'commenter',
          select: 'name',
        },
      })
      .populate('user', '_id name avatar')
      .limit(5);
    res.status(200).json({ user: result, posts });
  } catch (err) {
    res.status(404).json({ status: 'fail', data: err.message });
  }
};

const getInfo = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await User.findById(userId)
      .select({ password: 0 })
      .populate({
        path: 'friends',
        select: '_id name status avatar',
      })
      .populate({
        path: 'posts',
        options: {
          sort: {
            createdAt: -1,
          },
        },
        populate: {
          path: 'comments',
          populate: {
            path: 'commenter',
            select: '_id name avatar',
          },
        },
      })
      .populate({
        path: 'notifications',
        options: {
          sort: {
            createdAt: -1,
          },
        },
        populate: {
          path: 'from',
          select: '_id name avatar',
        },
      });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Bad request' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const {
      name, gender, bio, age, avatar, backgroundImg, phone,
    } = req.body;
    await User.findByIdAndUpdate(userId, {
      avatar,
      backgroundImg,
      name,
      gender,
      bio,
      age,
      phone,
    });
    const updated = await User.findById(userId);
    res.json({
      avatar: updated.avatar,
      backgroundImg: updated.backgroundImg,
      name: updated.name,
      gender: updated.gender,
      bio: updated.bio,
      age: updated.age,
      phone: updated.phone,
    });
  } catch (err) {
    res.status(400).json({ message: 'update failed' });
  }
};

const cloudinaryUpload = async (req, res, next) => {
  try {
    if (req.files.avatar) {
      console.log('uploading avatar');
      const { path: avatarPath } = req.files.avatar[0];
      const avatarName = req.files.avatar[0].originalname.split('.')[0];
      const avatarRes = await cloudinary.uploader.upload(avatarPath, {
        public_id: `CIS557/${avatarName}`,
      });
      fs.unlinkSync(avatarPath);
      req.body.avatar = avatarRes.url;
    }
    if (req.files.backgroundImg) {
      console.log('uploading background img');
      console.log(req.files.backgroundImg[0]);
      const { path: backgroundImgPath } = req.files.backgroundImg[0];
      const backgroundImgName = req.files.backgroundImg[0].originalname.split('.')[0];
      // upload avatar to cloud
      const backgroundImgRes = await cloudinary.uploader.upload(
        backgroundImgPath,
        {
          public_id: `CIS557/${backgroundImgName}`,
        },
      );
      fs.unlinkSync(backgroundImgPath);
      req.body.backgroundImg = backgroundImgRes.url;
    }

    next();
  } catch (err) {
    if (req.files.avatar && req.files.avatar[0] && req.files.avatar[0].path) {
      const { path: avatarPath } = req.files.avatar[0];
      fs.unlinkSync(avatarPath);
    }
    if (
      req.files.backgroundImg
      && req.files.backgroundImg[0]
      && req.files.backgroundImg[0].path
    ) {
      const { path: backgroundImgPath } = req.files.backgroundImg[0];
      fs.unlinkSync(backgroundImgPath);
    }
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const online = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await User.findById(userId);
    user.status = 'online';
    await user.save();
    return res.json({ message: 'onlined' });
  } catch (err) {
    return res.status(400).json({ message: 'failed' });
  }
};

const offline = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await User.findById(userId);
    user.status = 'offline';
    await user.save();
    return res.json({ message: 'offlined' });
  } catch (err) {
    return res.status(400).json({ message: 'offlined' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateProfile,
  getInfo,
  cloudinaryUpload,
  online,
  offline,
};
