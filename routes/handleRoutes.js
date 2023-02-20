const express = require('express');

const router = express.Router();
const passport = require('passport');
const handleController = require('../controllers/handle/handleController');

/**
 * @route GET /api/handle/search
 * @desc search groups and friends
 * @access public
 */
router.post('/search', handleController.search);

module.exports = router;
