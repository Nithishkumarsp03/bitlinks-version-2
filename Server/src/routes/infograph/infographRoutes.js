const express = require("express");
const router = express.Router();

const fetchPerson = require('../../controllers/infograph/person/fetchPerson');
const updatePerson = require('../../controllers/infograph/person/updatePerson');

const fetchExperience = require('../../controllers/infograph/fetchExperience');
const updateExperience = require('../../controllers/infograph/updateExperience');

const fetchCompany = require('../../controllers/infograph/company/fetchCompany');
const updateCompany = require('../../controllers/infograph/company/updateCompany');

const fetchExpertise = require('../../controllers/infograph/expertise/fetchExpertise');
const updateExpertise = require('../../controllers/infograph/expertise/updateExpertise');

const fetchPlacement = require('../../controllers/infograph/placement/fetchPlacement');
const updatePlacement = require('../../controllers/infograph/placement/updatePlacement');

const fetchInternship = require('../../controllers/infograph/internship/fetchInternship');
const updateInternship = require('../../controllers/infograph/internship/updateInternship');

const fetchConsultancy = require('../../controllers/infograph/consultancy/fetchConsultancy');
const updateConsultancy = require('../../controllers/infograph/consultancy/updateConsultancy');

const fetchAlumni = require('../../controllers/infograph/alumni/fetchAlumni');
const updateAlumni = require('../../controllers/infograph/alumni/updateAlumni');

//Fetch Routes
router.post('/fetch/person', fetchPerson.fetchPerson);
router.post('/fetch/experience', fetchExperience.fetchExperience);
router.post('/fetch/company', fetchCompany.fetchCompany);
router.post('/fetch/expertise', fetchExpertise.fetchExpertise);
router.post('/fetch/placement', fetchPlacement.fetchPlacement);
router.post('/fetch/internship', fetchInternship.fetchInternship);
router.post('/fetch/consultancy', fetchConsultancy.fetchConsultancy);
router.post('/fetch/alumni', fetchAlumni.fetchAlumni);

//Update Routes
router.put('/update/person', updatePerson.updatePerson);
router.put('/update/experience', updateExperience.updateExperience);
router.put('/update/company', updateCompany.updateCompany);
router.put('/update/expertise', updateExpertise.updateExpertise);
router.put('/update/placement', updatePlacement.updatePlacement);
router.put('/update/consultancy', updateConsultancy.updateConsultancy);
router.put('/update/internship', updateInternship.updateInternship);
router.put('/update/alumni', updateAlumni.updateAlumni);

module.exports = router