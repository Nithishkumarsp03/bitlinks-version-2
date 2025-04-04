const express = require("express");
const router = express.Router();
const companyRoute = require('../../controllers/settings/company');
const locationRoute = require('../../controllers/settings/location');
const roleRoute = require('../../controllers/settings/role');
const skillsetRoute = require('../../controllers/settings/skillset');
const domainRoute = require('../../controllers/settings/domain');
const loginRoute = require('../../controllers/settings/login');
const report = require('../../controllers/settings/report')

router.get('/location/fetchdata', locationRoute.fetchLocation); 
router.get('/companyname/fetchdata', companyRoute.fetchCompany);
router.get('/role/fetchdata', roleRoute.fetchRole);
router.get('/skillset/fetchdata', skillsetRoute.fetchSkillset);
router.get('/domain/fetchdata', domainRoute.fetchDomain);
router.get('/login/fetchdata', loginRoute.fetchLogin);
router.post('/generatereport', report.generateReport);

router.post('/location/adddata', locationRoute.addLocation);
router.post('/companyname/adddata', companyRoute.addCompany);
router.post('/role/adddata', roleRoute.addRole);
router.post('/skillset/adddata', skillsetRoute.addSkillset);
router.post('/domain/adddata', domainRoute.addDomain);
router.post('/login/adddata', loginRoute.addLogin);

router.delete('/location/deletedata', locationRoute.deleteData);
router.delete('/companyname/deletedata', companyRoute.deleteData);
router.delete('/role/deletedata', roleRoute.deleteData);
router.delete('/skillset/deletedata', skillsetRoute.deleteData);
router.delete('/domain/deletedata', domainRoute.deleteData);
router.delete('/login/deletedata', loginRoute.deleteData);

router.put('/location/update', locationRoute.updateData);
router.put('/companyname/update', companyRoute.updateData);
router.put('/role/update', roleRoute.updateData);
router.put('/skillset/update', skillsetRoute.updateData);
router.put('/domain/update', domainRoute.updateData);
router.put('/login/update', loginRoute.updateData);

module.exports = router