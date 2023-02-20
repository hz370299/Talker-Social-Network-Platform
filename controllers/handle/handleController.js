const User = require('../../models/User');
const Group = require('../../models/Group');

const search = async (req, res) => {
  // search user by regex;
  try {
    const { query } = req.body;
    const { all = false } = req.query;
    const users = await User.find({ name: new RegExp(`${query}.*`, 'i') })
      .select(['_id', 'name', 'avatar'])
      .limit(all ? null : 5);
    const groups = await Group.find({
      name: new RegExp(`${query}.*`, 'i'),
    })
      .find({ type: 'public' })
      .select(['_id', 'name', 'avatar'])
      .limit(all ? null : 5);
    return res.json({
      users,
      groups,
    });
  } catch (err) {
    res.status(400).json({ message: 'Something wrong' });
  }
};

module.exports = {
  search,
};
