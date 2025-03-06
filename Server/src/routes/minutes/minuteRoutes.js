const express = require("express");
const router = express.Router();
const fetchMinutes = require("../../controllers/minutes/fetchMinutes")
const addMinutes = require("../../controllers/minutes/addMinutes");
const editMinutes = require("../../controllers/minutes/editMinutes");
const fetchTempminutes = require("../../controllers/minutes/fetchTempminutes");

router.post('/fetchminutes/uuid', fetchMinutes.fetchMinutes);
router.post('/addminutes', addMinutes.addMinutes);
router.put('/updateminutes', editMinutes.editMinutes);  
router.put('/updatestatus', editMinutes.updateStatus);  
router.get('/fetchtempminutes', fetchTempminutes.fetchTempminutes);

module.exports = router