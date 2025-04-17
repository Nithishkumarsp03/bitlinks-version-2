const express = require("express");
const router = express.Router();
const interactiondropdown = require('../../controllers/dropdown/interaction');
const fetchProjects = require("../../controllers/dropdown/project"); 
const fetchAddress = require("../../controllers/dropdown/address");
const fetchRole = require("../../controllers/dropdown/role");
const fetchSkills = require("../../controllers/dropdown/skillset");
const fetchCompany = require('../../controllers/dropdown/companyname');
const fetchps = require('../../controllers/dropdown/ps');
const addcompany = require('../../controllers/dropdown/Adddata/addcompany');
const adddomain = require('../../controllers/dropdown/Adddata/adddomain');
const addlocation = require('../../controllers/dropdown/Adddata/addlocation');
const addrole = require('../../controllers/dropdown/Adddata/addrole')
const addskillset = require('../../controllers/dropdown/Adddata/addskillset');

router.get('/interactions', interactiondropdown.fetchdata);
router.get('/projectname', fetchProjects.fetchdata);
router.get('/addressdata', fetchAddress.fetchdata);
router.get('/roledata', fetchRole.fetchdata);
router.get('/skillsets', fetchSkills.fetchdata);
router.get('/companynamedata', fetchCompany.fetchdata);

router.get('/companynames', fetchps.companyname)
router.get('/rolevalues', fetchps.role);

router.post('/companynamedata/add', addcompany.addcompany);
router.post('/addressdata/add', addlocation.addlocation);
router.post('/domaindata/add', adddomain.adddomain);
router.post('/roledata/add', addrole.addrole);
router.post('/skillsets/add', addskillset.addskillset);

module.exports = router;