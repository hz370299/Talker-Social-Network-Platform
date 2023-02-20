const yup = require('yup');

const profileSchema = yup.object({
  body: yup.object({
    name: yup.string().required(),
    gender: yup.string().required(),
    age: yup.number().required(),
    bio: yup.string().required(),
  }),
  files: yup.object({
    avatar: yup.mixed(),
    backgroundImg: yup.mixed(),
  }),
});

module.exports = profileSchema;
