const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require('node-cron');

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

const settingsRoute = require('./routes/settings/settingsRoute.js')

const { sendMinutesCron } = require('./controllers/notifications/sendMinutesnotification');

require("dotenv").config();
const path = require('path');
const api = process.env.API;

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
// app.get(`${api}/`, (req, res) => {
//   res.send("Welcome to the BITLINKS API!");
// });

// Authentication Routes
app.use(`${api}/api/auth`, authRoutes); // Use auth routes for login

// Static files middleware to serve uploaded files
app.use(`${api}/uploads`, express.static(path.join(__dirname, 'uploads')));

// Image Routes
app.use(`${api}/api`, uploadRoutes);

//Minute Routes
app.use(`${api}/api/minutes`, minuteRoutes);

//Middleware
app.use(authenticateToken);

//Add connection Routes
app.use(`${api}/api/add`, addconnectionRoutes);

// Person Routes
app.use(`${api}/api/person`, personRoutes);

//Network Routes
app.use(`${api}/api/network`, networkRoutes);

//Spoc Routes
app.use(`${api}/api/spoc`, spocRoutes);

//History Routes
app.use(`${api}/api/history`, historyRoutes);

//Project Routes
app.use(`${api}/api/project`, projectRoutes);

// //Minute Routes
// app.use(`${api}/api/minutes`, minuteRoutes);

//Dropdown Routes
app.use(`${api}/api/dropdown`, dropdownRoutes);

//Domain Routes
app.use(`${api}/api/domain`, domainRoutes);

//Notification & Email API routes
app.use(`${api}/api/notify`, notificationRoutes);

//Infograph Routes
app.use(`${api}/api/infograph`, infographRoutes);

//Entry data from SecureHub Routes
app.use(`${api}/api/securehub`, securehubRoutes);

//Settings Route
app.use(`${api}/api/settings`, settingsRoute);

// Schedule a job to run at 12:30 PM every day
cron.schedule('30 12 * * *', () => {
  // console.log("Cron job running at 12:30 PM");
  sendMinutesCron((err, result) => {
    if (err) {
      console.error("Error processing minutes at 12:30 PM:", err);
    } else {
      // console.log(result.message);
    }
  });
});

// Schedule a job to run at 3:30 PM every day
cron.schedule('47 19 * * *', () => {
  console.log("Cron job running at 3:30 PM");
  sendMinutesCron((err, result) => {
    if (err) {
      console.error("Error processing minutes at 3:30 PM:", err);
    } else {
      // console.log(result.message);
    }
  });
});

module.exports = app;
