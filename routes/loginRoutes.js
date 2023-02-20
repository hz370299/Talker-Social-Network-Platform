const express = require('express');
const LoginSchema = require('../controllers/validation/Login');
const validate = require('../controllers/validation/helper');
const { login } = require('../controllers/auth/loginController');

const router = express.Router();

router.post('/', validate(LoginSchema), login);

module.exports = router;
