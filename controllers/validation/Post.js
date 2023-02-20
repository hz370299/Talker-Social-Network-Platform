const yup = require('yup');

const postSchema = yup.object({
  body: yup.object({
    content: yup.string(),
  }),
});

module.exports = postSchema;
