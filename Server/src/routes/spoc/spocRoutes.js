const express = require("express");
const router = express.Router();
const spocController = require('../../controllers/spoc/spocController');
const fetchSpoc = require('../../controllers/spoc/fetchData')

router.get('/fetchdata', spocController.fetchdata);
router.get('/fetchspoc', fetchSpoc.fetchSpoc);

module.exports = router