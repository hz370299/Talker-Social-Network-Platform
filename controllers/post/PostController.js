const fs = require('fs');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Notification = require('../../models/Notification');
const Comment = require('../../models/Comment');
const cloudinary = require('../../config/cloudinary');

const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (err) {
    res.status(400).json({ message: 'Something wrong!' });
  }
};

const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: 'Invalid Id' });
  }
};

const getPostsByUserId = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { page = 0 } = req.query;
    const skip = page * 5;
    const posts = await Post.find({
      user: userId,
    })
      .sort('-createdAt')
      .populate({
        path: 'user',
        select: 'name avatar _id',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'commenter',
          select: '_id name avatar',
        },
      })
      .skip(skip)
      .limit(5);
    return res.json({ posts });
  } catch (err) {
    res.status(400).json({ message: 'Fetch failed' });
  }
};

const getNetworkPosts = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { page = 0 } = req.query;
    const skip = page * 5;
    const curUser = await User.findById(userId);
    const { friends } = curUser;
    friends.push(userId);
    const networkPosts = await Post.find({
      user: {
        $in: friends,
      },
    })
      .sort('-createdAt')
      .populate({
        path: 'user',
        select: 'name avatar _id',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'commenter',
          select: '_id name avatar',
        },
      })
      .skip(skip)
      .limit(5);
    return res.json({ posts: networkPosts });
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};
const createPost = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const {
      content = '', imgs = [], videos = [], audios = [],
    } = req.body;
    const post = new Post({
      user: userId,
      content,
      imgs,
      videos,
      audios,
    });
    const saved = await post.save();
    // broadcast notification to all friends
    const user = await User.findById(userId);
    for (const e of user.friends) {
      new Notification({
        type: 'post',
        from: userId,
        to: e,
      }).save();
    }
    const completePost = await Post.findById(saved._id)
      .populate({
        path: 'user',
        select: 'name avatar _id',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'commenter',
          select: '_id name avatar',
        },
      });
    res.json(completePost);
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const postCloudinaryUpload = async (req, res, next) => {
  try {
    req.files = req.files || {};
    const { imgs = [], videos = [], audios = [] } = req.files;
    req.body.imgs = [];
    req.body.videos = [];
    req.body.audios = [];
    // upload img one by one and parse Url to req.body
    for (const e of imgs) {
      const response = await cloudinary.uploader.upload(e.path, {
        public_id: `CIS557/${e.originalname.split('.')[0]}`,
      });
      req.body.imgs.push(response.url);
      fs.unlinkSync(e.path);
    }
    //
    for (const e of videos) {
      const response = await cloudinary.uploader.upload(e.path, {
        public_id: `CIS557/${e.originalname.split('.')[0]}`,
        resource_type: 'video',
      });
      req.body.videos.push(response.url);
      fs.unlinkSync(e.path);
    }
    for (const e of audios) {
      const response = await cloudinary.uploader.upload(e.path, {
        public_id: `CIS557/${e.originalname.split('.')[0]}`,
        resource_type: 'video',
      });
      req.body.audios.push(response.url);
      fs.unlinkSync(e.path);
    }
    next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id: postId } = req.params;
    // check the post owner
    const post = await Post.findById(postId);
    if (post.user.toString() !== userId.toString()) {
      return res
        .status(400)
        .json({ message: 'You are not the onwer of the post' });
    }
    // delete post
    await Post.findByIdAndDelete(postId);
    return res.json({ message: 'Deleted!' });
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};
const isPostExisting = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.json({ message: 'Post is not existing' });
    req.body.post = post;
    next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const commentPost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { _id: userId } = req.user;
    const { content, post } = req.body;
    // console.log(postId);
    // create new comment
    const comment = new Comment({
      post: postId,
      commenter: userId,
      content,
    });
    await comment.save();
    // create notification
    // check if the commenter is user self
    if (userId.toString() !== post.user.toString()) {
      const notification = new Notification({
        type: 'comment',
        from: userId,
        to: post.user,
      });
      await notification.save();
    }
    const newComment = await comment.populate('commenter', 'name');
    // console.log(newComment);
    return res.status(201).json({ comment: newComment });
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { post } = req.body;
    // check if the user already liked the post
    if (post.likes.indexOf(userId) !== -1) {
      return res.status(400).json({ message: 'You already liked the post' });
    }
    // add user to likes
    post.likes.push(userId);
    await post.save();
    if (userId.toString() !== post.user.toString()) {
      // emit a new notification
      const notification = new Notification({
        type: 'like',
        from: userId,
        to: post.user,
      });
      await notification.save();
    }
    return res.json({ message: 'liked!', post });
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const unlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { _id: userId } = req.user;
    const { post } = req.body;
    // check user did not like the post
    const idx = post.likes.indexOf(userId);
    if (idx === -1) {
      return res.status(400).json({ message: 'You did not like the post' });
    }
    post.likes.splice(idx, 1);
    const newPost = await post.save();
    return res.json({ message: 'unliked!', newPost });
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id: commentId } = req.params;
    const { _id: userId } = req.user;
    const comment = await Comment.findById(commentId);
    if (comment.commenter.toString() !== userId.toString()) {
      return res.status(400).json({ message: 'You are not the commenter' });
    }
    await Comment.findByIdAndDelete(commentId);
    return res.json({ message: 'deleted' });
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};
module.exports = {
  getAllPost,
  getPostById,
  createPost,
  getNetworkPosts,
  deletePost,
  commentPost,
  likePost,
  unlikePost,
  deleteComment,
  postCloudinaryUpload,
  isPostExisting,
  getPostsByUserId,
};
