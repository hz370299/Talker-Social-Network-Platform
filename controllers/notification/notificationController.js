const Notification = require('../../models/Notification');
const Message = require('../../models/Message');

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({}).lean();
    res.json(notifications);
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const notifications = await Notification.find({ to: userId });
    return res.json(notifications);
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    res.json(notification);
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const readNonMessageNotifications = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const updated = await Notification.updateMany(
      {
        to: userId,
        read: false,
        type: {
          $nin: ['message', 'groupMessage'],
        },
      },
      { read: true },
    );
    return res.json({ updated });
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const readMessageNotifications = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const { _id: userId } = req.user;
    await Notification.updateMany(
      { chat: chatId, to: userId, read: false },
      { read: true },
    );
    await Message.updateMany({ chat: chatId, sender: { $ne: userId } }, { read: true });
    return res.json({ message: 'readed' });
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

const readGroupMessageNotifications = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { _id: userId } = req.user;
    await Notification.updateMany(
      {
        group: groupId,
        to: userId,
        read: false,
      },
      { read: true },
    );
    return res.json({ message: 'read group message notifications' });
  } catch (err) {
    res.status(400).json({ type: err.name, message: err.message });
  }
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  readNonMessageNotifications,
  readMessageNotifications,
  getMyNotifications,
  readGroupMessageNotifications,
};
