const express = require("express");
const router = express.Router();
const personFetch = require("../../controllers/person/personfetch");
const uuidFetch = require("../../controllers/person/uuidfetch")
const fetchdata = require("../../controllers/person/fetchdata")
const fetchConnections = require("../../controllers/person/fetchConnections");
const updateStatus = require("../../controllers/person/updateStatus");
const deleteData = require("../../controllers/person/detetePerson");
const fetchRanks = require("../../controllers/person/fetchRanks")

router.post('/fetchdata', personFetch.fetchPerson);
router.post('/fetchdata/uuid', uuidFetch.uuidFetch);
router.post('/fetchpersondata', fetchdata.fetchdata);
router.post('/fetchpersonconnections', fetchConnections.fetchdata);
router.put('/updatestatus', updateStatus.updateStatus);
router.delete('/delete', deleteData.deletePerson);
router.post('/fetchRanks/connections', fetchRanks.fetchConnectionsRank);
router.get('/fetchRanks/networks', fetchRanks.fetchNetworksrank);

module.exports = router