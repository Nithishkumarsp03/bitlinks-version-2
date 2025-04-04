const express = require("express");
const router = express.Router();
const addController = require('../../controllers/addconnection/addController')
const nameCheckcontroller = require('../../controllers/addconnection/nameCheckcontroller')
const addAlumni = require("../../controllers/addconnection/addalumni");

router.post('/newconnection', addController.addConnection);
router.post('/check-availability', nameCheckcontroller.nameCheck);
router.post('/alumni', addAlumni.addAlumni);

module.exports = router;