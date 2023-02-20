const express = require('express');
const getRootController = require('../controllers/root/getRootController');

const router = express.Router();

router.route('/').get(getRootController.getRoot);

module.exports = router;
