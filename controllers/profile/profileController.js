const Profile = require('../../models/Profile');

const getAllProfiles = async (_req, res) => {
  try {
    const result = await Profile.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ status: 'fail', data: err.message });
  }
};

const getProfileById = async (req, res) => {
  try {
    const { profileId } = req.params;
    const result = await Profile.findById({ _id: profileId });
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ status: 'fail', data: err.message });
  }
};

const createProfile = async (req, res) => {
  try {
    const result = await Profile.create(req.body);
    res.status(201).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', data: err.message });
  }
};

const updateProfileById = async (req, res) => {
  try {
    const { profileId } = req.params;
    const query = {
      nickname: req.body.nickname,
      gender: req.body.gender,
      bio: req.body.bio,
      avatar: req.body.avatar,
      age: req.body.age,
    };
    const result = await Profile.findOneAndUpdate({ _id: profileId }, query, { new: true });
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ status: 'fail', data: err.message });
  }
};

module.exports = {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfileById,
};
