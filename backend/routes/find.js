const express = require('express');
const router = express.Router();

const userModel = require('../models/User');
const checkAuth = require('../middleware/check-auth');

router.post('/findUser', checkAuth, (req, res) => {

});

module.exports = router;
