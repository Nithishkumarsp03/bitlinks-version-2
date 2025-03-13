const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const validateCsrfToken = require("../../middleware/validateCsrfToken");  // Adjust the path based on your project structure
const api = process.env.API;

const router = express.Router();

router.get(`${api}/api/auth/google`, (req, res, next) => {
  // const csrfToken = req.query.csrf_token;

  // if (!csrfToken) {
  //     return res.status(400).json({ error: "You are not authorized to proceed. Token Missing" });
  // }

  // req.session.csrfToken = csrfToken;

  next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));


// Callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.REACT_APP_URL}/`,
  }),
  function (req, res) {
    // Includ e the profile picture directly from the Google response
    req.user.token = generateToken(
      req.user,
      600,
      req.user.NAME,
      req.user.ROLE,
      req.user.ID,
      req.user.EMAIL,
      req.user.PROFILE_PICTURE,
      req.user.updatedAt
    );
    // console.log("token:", req.user.token);

    // Prepare the JSON response with profile picture
    const responseJson = {
      token: req.user.token,
      NAME: req.user.NAME,
      ROLE: req.user.ROLE,
      ID: req.user.ID,
      EMAIL: req.user.EMAIL,
      PROFILE_PICTURE: req.user.PROFILE_PICTURE, // Include profile picture in the response
      updatedAt: req.user.updatedAt,
    };

    // Redirect the user to a specific page with the JSON data as query parameters
    res.redirect(
      `${process.env.REACT_APP_URL}/welcome?data=${encodeURIComponent(
        JSON.stringify(responseJson)
      )}`
    );
  }
);

const generateToken = (
  user,
  expiresIn,
  NAME,
  ROLE,
  ID,
  EMAIL,
  PROFILE_PICTURE,
  updatedAt
) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  return jwt.sign(
    {
      NAME: NAME,
      ROLE: ROLE,
      ID: ID,
      EMAIL: EMAIL,
      PROFILE_PICTURE: PROFILE_PICTURE,
      updatedAt: updatedAt,
    },
    JWT_SECRET,
    { expiresIn: "12h" }
  );
};

module.exports = router;
