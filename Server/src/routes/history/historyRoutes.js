const express = require("express");
const router = express.Router();
const addHistory = require('../../controllers/history/addhistory');
const fetchHistory = require('../../controllers/history/fetchhistory');
const {authenticateToken} = require('../../middleware/authMiddleware')

// console.log('History route')

router.post('/adddata', addHistory.addHistory);
router.post('/fetchdata', fetchHistory.fetchHistory);

module.exports = router