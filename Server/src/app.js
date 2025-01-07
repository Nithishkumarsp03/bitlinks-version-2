const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/login/authRoutes");
const personRoutes = require("./routes/person/personRoutes");
const networkRoutes = require("./routes/network/networkRoutes")
const uploadRoutes = require("./routes/uploadImage/upload");
const historyRoutes = require("./routes/history/historyRoutes");
const dropdownRoutes = require("./routes/dropdown/dropdownRoutes");
require("dotenv").config();
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root route to show welcome message
app.get("/", (req, res) => {
  res.send("Welcome to the BITLINKS API!");
});

// Authentication Routes
app.use("/api/auth", authRoutes); // Use auth routes for login

// Person Routes
app.use("/api/person", personRoutes);

//Network Routes
app.use("/api/network", networkRoutes);

// Image Routes
app.use('/api', uploadRoutes);

//History Routes
app.use('/api/history', historyRoutes);

// Static files middleware to serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Dropdown Routes
app.use('/api/dropdown', dropdownRoutes);

module.exports = app;
