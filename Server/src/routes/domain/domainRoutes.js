const express = require("express");
const router = express.Router();
const fetchDomain = require("../../controllers/domain/fetchData")

router.get('/fetchdata', fetchDomain.fetchDomain);

module.exports = router