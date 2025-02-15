const express = require("express");
const router = express.Router();
const fetchMinutes = require("../../controllers/minutes/fetchMinutes")
const addMinutes = require("../../controllers/minutes/addMinutes");
const editMinutes = require("../../controllers/minutes/editMinutes");

router.post('/fetchminutes/uuid', fetchMinutes.fetchMinutes);
router.post('/addminutes', addMinutes.addMinutes);
router.put('/updateminutes', editMinutes.editMinutes);  
router.put('/updatestatus', editMinutes.updateStatus);  

module.exports = router