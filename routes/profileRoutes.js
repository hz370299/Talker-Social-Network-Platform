const express = require('express');

const router = express.Router();

router.route('/').get().post();
router.route('/:profileId').get().put();

module.exports = router;
