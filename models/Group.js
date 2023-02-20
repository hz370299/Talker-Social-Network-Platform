const mongoose = require('mongoose');

const Group = new mongoose.Schema(
  {
    type: {
      type: String,
      default: 'public',
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    administrators: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],

    name: {
      type: String,
      required: true,
    },

    avatar: {
      // url or encoded string
      type: String,
      default:
        'https://res.cloudinary.com/dtubqsxz5/image/upload/v1638668562/CIS557/default_avatar_biwwa1.jpg',
    },

    bio: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
      },
    ],

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

Group.virtual('messages', {
  ref: 'GroupMessage',
  localField: '_id',
  foreignField: 'group',
  options: {
    sort: {
      createdAt: -1,
    },
  },
});

Group.virtual('posts', {
  ref: 'GroupPost',
  localField: '_id',
  foreignField: 'group',
  options: {
    sort: {
      createdAt: -1,
    },
  },
});
module.exports = mongoose.model('Group', Group);
