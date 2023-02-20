const yup = require('yup');

const groupSchema = yup.object({
  body: yup.object({
    name: yup.string().required(),
    bio: yup.string().required(),
  }),

});

module.exports = { groupSchema };
