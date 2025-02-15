const express = require("express");
const router = express.Router();
const addController = require('../../controllers/addconnection/addController')
const nameCheckcontroller = require('../../controllers/addconnection/nameCheckcontroller')

router.post('/newconnection', addController.addConnection);
router.post('/check-availability', nameCheckcontroller.nameCheck);

module.exports = router;