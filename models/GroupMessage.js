const mongoose = require('mongoose');

const GroupMessage = new mongoose.Schema(
  {
    type: {
      type: String,
      require: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },

    // only contains plain message
    content: {
      type: String,
      default: '',
    },

    // only contains stream
    media: {
      type: String,
      default: '',
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

module.exports = mongoose.model('GroupMessage', GroupMessage);
