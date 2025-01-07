const express = require("express");
const router = express.Router();
const interactiondropdown = require('../../controllers/dropdown/interaction');

router.get('/interactions', interactiondropdown.fetchdata);

module.exports = router;