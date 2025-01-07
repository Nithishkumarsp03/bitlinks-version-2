const express = require("express");
const router = express.Router();
const fetchData = require("../../controllers/networks/fetchdata")

router.get('/fetchdata', fetchData.fetchdata);

module.exports = router