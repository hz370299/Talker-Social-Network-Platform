const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
require('dotenv').config({ path: `${__dirname}/../../config.env` });

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.status === 'deactivated') {
      return res.status(404).json({ message: 'not found or deactivated' });
    }
    let { attempts, lockoutUntil } = user;
    const now = Date.now();
    // under lockout
    if (lockoutUntil !== -1 && lockoutUntil > now) {
      return res.status(401).json({
        message: `You account will be unlocked until ${new Date(lockoutUntil).toString()}`,
      });
    }
    // already passed the lockout time reset attempts and lockoutuntil, reset
    if (lockoutUntil !== -1 && lockoutUntil <= now) {
      attempts = 0;
      lockoutUntil = -1;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const payload = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
        (err, token) => {
          if (err) {
            return res
              .status(500)
              .json({ type: err.name, message: err.message });
          }
          user.attempts = 0;
          user.lockoutUntil = -1;
          user.save().then(() => {
            res.json({
              token: `Bearer ${token}`,
            });
          });
        },
      );
    } else {
      attempts += 1;
      if (attempts >= 3) {
        lockoutUntil = Date.now() + 5 * 60 * 1000;
      }
      user.attempts = attempts;
      user.lockoutUntil = lockoutUntil;
      user
        .save()
        .then(() => res.status(400).json({ message: 'email or password incorrect' }));
    }
  } catch (err) {
    console.log('ok1');
    res.status(400).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { prevPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(prevPassword, user.password);
    if (!isMatch || newPassword.length < 6) {
      return res
        .status(401)
        .json({ message: 'Incorrect password or invalid passowrd' });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    await user.save();
    return res.json({ message: 'Successfully changed' });
  } catch (err) {
    return res.status(400).json({ message: 'change failed' });
  }
};

const deactivateAccount = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await User.findById(userId);
    user.status = 'deactivated';
    await user.save();
    return res.json({ message: 'deactivated' });
  } catch (err) {
    return res.status(400).json({ message: 'deactivate failed' });
  }
};

const activateAccount = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findById(userId);
    user.status = 'offline';
    await user.save();
    return res.json({ message: 'Activated' });
  } catch (err) {
    return res.status(400).json({ message: 'activate failed' });
  }
};

module.exports = {
  login,
  changePassword,
  deactivateAccount,
  activateAccount,
};
