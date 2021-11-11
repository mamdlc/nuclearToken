const express = require('express');
const models = require('./BIM360/models');
const cors = require('cors');

var router = express.Router();

router.get('/models/get',cors(), models.get);

module.exports = router;