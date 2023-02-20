const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('Notification', NotificationSchema);
