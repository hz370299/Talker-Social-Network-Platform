const express = require('express');
const upload = require('../config/upload');
const postSchema = require('../controllers/validation/Post');
const validate = require('../controllers/validation/helper');
const { isAuthenticated } = require('../controllers/auth/authHelper');

const cpUpload = upload.fields([
  { name: 'imgs', maxCount: 5 },
  { name: 'videos', maxCount: 2 },
  { name: 'audios', maxCount: 1 },
]);
const {
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
} = require('../controllers/post/PostController');

const router = express.Router();

/**
 * @router GET /api/post
 * @desc GET all posts
 * @access private
 */
router.get('/', isAuthenticated, getAllPost);

/**
 * @router GET /api/post/getnetworkposts
 * @desc GET ALL posts of yours and friends
 * @access private
 */
router.get('/getnetworkposts', isAuthenticated, cpUpload, getNetworkPosts);

/**
 * @router GET /api/post/getpostsbyuserid
 * @desc get posts by userid
 * @access public
 */
router.get('/user/:id', getPostsByUserId);

/**
 * @route POST /api/post
 * @desc Create Post
 * @access Private
 */
router.post(
  '/',
  isAuthenticated,
  validate(postSchema),
  cpUpload,
  postCloudinaryUpload,
  createPost,
);

/**
 * @router POST /api/post/comment/:id
 * @desc comment post
 * @access private
 */
router.post('/comment/:id', isAuthenticated, isPostExisting, commentPost);

/**
 * @router POST /api/post/like/:id
 * @desc like post
 * @access private
 */
router.post('/like/:id', isAuthenticated, isPostExisting, likePost);

/**
 * @router POST /api/post/unlike/:id
 * @desc unlike post
 * @access private
 */
router.post('/unlike/:id', isAuthenticated, isPostExisting, unlikePost);

/**
 * @route DELETE /api/post/comment/:id
 * @desc delete comment by id
 * @access private
 */
router.delete('/comment/:id', isAuthenticated, deleteComment);

/**
 * @router DELETE /api/post/:id
 * @desc delete post
 * @access private
 */
router.delete('/:id', isAuthenticated, isPostExisting, deletePost);

module.exports = router;
