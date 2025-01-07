require("dotenv").config();
const express = require("express");
const app = require("./src/app"); // Import the app setup from src/app.js

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
