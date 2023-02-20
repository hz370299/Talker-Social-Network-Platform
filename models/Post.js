const mongoose = require('mongoose');

const Post = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

Post.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  options: { sort: { createdAt: -1 } },
});

module.exports = mongoose.model('Post', Post);
