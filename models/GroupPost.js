const mongoose = require('mongoose');

const GroupPost = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    content: {
      type: String,
      default: '',
    },
    imgs: [
      {
        type: String,
        required: false,
      },
    ],
    videos: [
      {
        type: String,
        required: false,
      },
    ],
    audios: [
      {
        type: String,
        required: false,
      },
    ],
    flag: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

GroupPost.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'groupPost',
  options: { sort: { createdAt: -1 } },
});

module.exports = mongoose.model('GroupPost', GroupPost);
