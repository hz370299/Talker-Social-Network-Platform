const fs = require('fs');

const validate = (schema) => async (req, res, next) => {
  try {
    // console.log('validating');
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
      files: req.files,
    });
    return next();
  } catch (err) {
    if (req.files.avatar) {
      fs.unlinkSync(req.files.avatar[0].path);
    }
    if (req.files.backgroundImg) {
      fs.unlinkSync(req.files.backgroundImg[0].path);
    }
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

module.exports = validate;
