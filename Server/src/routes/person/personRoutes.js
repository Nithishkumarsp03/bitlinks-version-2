const express = require("express");
const router = express.Router();
const personFetch = require("../../controllers/person/personfetch");
const uuidFetch = require("../../controllers/person/uuidfetch")
const fetchdata = require("../../controllers/person/fetchdata")

router.post('/fetchdata', personFetch.fetchPerson);
router.post('/fetchdata/uuid', uuidFetch.uuidFetch);
router.post('/fetchpersondata', fetchdata.fetchdata);

module.exports = router