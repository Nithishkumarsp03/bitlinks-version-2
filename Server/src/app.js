const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//Auth - Configurations
const auth = require("./routes/oAuth/auth.js");
const passport = require("passport");
const session = require("express-session");
const passportConfig = require("./middleware/passport.js");
const {authenticateToken} = require("./middleware/authMiddleware.js");

const authRoutes = require("./routes/login/authRoutes");
const personRoutes = require("./routes/person/personRoutes");
const networkRoutes = require("./routes/network/networkRoutes");
const spocRoutes = require("./routes/spoc/spocRoutes");
const uploadRoutes = require("./routes/uploadImage/upload");
const historyRoutes = require("./routes/history/historyRoutes");
const dropdownRoutes = require("./routes/dropdown/dropdownRoutes");
const addconnectionRoutes = require("./routes/addconnection/addRoutes")
const projectRoutes = require("./routes/project/projectRoutes");
const minuteRoutes = require("./routes/minutes/minuteRoutes")
const domainRoutes = require("./routes/domain/domainRoutes");
const notificationRoutes = require("./routes/notifications/notificationRoutes")
const infographRoutes = require("./routes/infograph/infographRoutes");
const securehubRoutes = require("./routes/entrydata/entryRoutes");

require("dotenv").config();
const path = require('path');

const app = express();

//Auth
app.use(
  session({
    secret: "this is my secrect code",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(auth);

// Middleware
app.use(cors({
  origin: '*', // Or specify your allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(bodyParser.json());


// Root route to show welcome message
app.get("/", (req, res) => {
  res.send("Welcome to the BITLINKS API!");
});

// Authentication Routes
app.use("/api/auth", authRoutes); // Use auth routes for login

// Static files middleware to serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Image Routes
app.use('/api', uploadRoutes);

//Middleware
app.use(authenticateToken);

//Add connection Routes
app.use("/api/add", addconnectionRoutes);

// Person Routes
app.use("/api/person", personRoutes);

//Network Routes
app.use("/api/network", networkRoutes);

//Spoc Routes
app.use("/api/spoc", spocRoutes);

//History Routes
app.use('/api/history', historyRoutes);

//Project Routes
app.use('/api/project', projectRoutes);

//Minute Routes
app.use('/api/minutes', minuteRoutes);

//Dropdown Routes
app.use('/api/dropdown', dropdownRoutes);

//Domain Routes
app.use('/api/domain', domainRoutes);

//Notification & Email API routes
app.use('/api/notify', notificationRoutes);

//Infograph Routes
app.use('/api/infograph', infographRoutes);

//Entry data from SecureHub Routes
app.use('/api/securehub', securehubRoutes);

module.exports = app;
