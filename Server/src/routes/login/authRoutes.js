const express = require("express");
const router = express.Router();
const authController = require("../../controllers/login/authController");
const auth = require('../oAuth/auth')
const passport = require("passport");

// Login route
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

module.exports = router;