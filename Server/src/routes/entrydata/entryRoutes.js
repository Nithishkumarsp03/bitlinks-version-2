const express = require("express");
const router = express.Router();
const insertController = require('../../controllers/entrydata/insertdata');
const fetchController = require('../../controllers/entrydata/fetchData');
const mergeController = require('../../controllers/entrydata/insertMerge');

router.post('/insertdata', insertController.insertData);
router.post('/mergecontacts', mergeController.insertMerge);
router.get('/fetchdata', fetchController.fetchdata);

module.exports = router;