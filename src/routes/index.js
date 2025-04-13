const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');

router.use('/rooms', verifyToken, require('./room.routes'));

module.exports = router;

