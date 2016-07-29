'use strict';

const express = require('express');

let router = express.Router();

router.use('/users', require('./users'));
// router.use('/yelps', require('./yelps'));

module.exports = router;
