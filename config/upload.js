const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../assets`);
  },
  filename: (req, file, cb) => {
    const fileExt = file.originalname.split('.').pop();
    const filename = `${new Date().getTime()}.${fileExt}`;
    cb(null, filename);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'video/mp4'
    || file.mimetype === 'image/png'
    || file.mimetype === 'image/jpeg'
    || file.mimetype === 'image/gif'
    || file.mimetype === 'video/mp4'
    || file.mimetype === 'audio/ogg'
    || file.mimetype === 'audio/mpeg'
    || file.mimetype === 'audio/mp3'
  ) {
    cb(null, true);
  } else {
    cb(
      {
        message: 'Unsupported File Format',
      },
      false,
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fieldNameSize: 200,
    fileSize: 30 * 1024 * 1024,
  },
  fileFilter,
});

module.exports = upload;
