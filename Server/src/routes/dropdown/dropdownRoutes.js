const express = require("express");
const router = express.Router();
const interactiondropdown = require('../../controllers/dropdown/interaction');
const fetchProjects = require("../../controllers/dropdown/project"); 
const fetchAddress = require("../../controllers/dropdown/address");
const fetchRole = require("../../controllers/dropdown/role");
const fetchSkills = require("../../controllers/dropdown/skillset");
const fetchCompany = require('../../controllers/dropdown/companyname');

router.get('/interactions', interactiondropdown.fetchdata);
router.get('/projectname', fetchProjects.fetchdata);
router.get('/addressdata', fetchAddress.fetchdata);
router.get('/roledata', fetchRole.fetchdata);
router.get('/skillsets', fetchSkills.fetchdata);
router.get('/companynamedata', fetchCompany.fetchdata);

module.exports = router;