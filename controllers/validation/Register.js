const yup = require('yup');

const RegisterSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
    name: yup.string().required(),
    password: yup.string().min(6).max(18).required(),
    gender: yup.string(),
    bio: yup.string(),
    age: yup.number(),
  }),
});

module.exports = RegisterSchema;
