const express = require("express");
const router = express.Router();
const addprojectController = require('../../controllers/project/addProject')
const fetchprojectController = require("../../controllers/project/fetchProject")
const fetchallproject = require("../../controllers/project/fetchallproject")

router.post('/adddata', addprojectController.addProject);
router.post('/fetchdata', fetchprojectController.fetchProject);
router.get('/fetchalldata', fetchallproject.fetchallProject);

module.exports = router