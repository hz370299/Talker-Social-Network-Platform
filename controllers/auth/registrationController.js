const bcrypt = require('bcrypt');
const User = require('../../models/User');

const registration = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'exists' });
    }
    const newUser = new User({
      name: req.body.name,
      email,
      password,
      age: req.body.age,
      gender: req.body.gender,
      phone: req.body.phone,
    });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    newUser.password = hash;
    const result = await newUser.save();
    return res.json(result);
  } catch (err) {
    res.status(404).json({ status: 'fail', data: err.message });
  }
};

module.exports = {
  registration,
};
