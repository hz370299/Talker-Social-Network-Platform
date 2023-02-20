const express = require('express');
const { registration } = require('../controllers/auth/registrationController');
const validate = require('../controllers/validation/helper');
const RegisterSchema = require('../controllers/validation/Register');

const router = express.Router();

router.post('/', validate(RegisterSchema), registration);

module.exports = router;
