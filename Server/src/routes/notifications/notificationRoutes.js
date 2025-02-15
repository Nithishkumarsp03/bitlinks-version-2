const express = require("express");
const router = express.Router();
const Spocnotification = require("../../controllers/notifications/spocremainder");
const taskCompleted = require("../../controllers/notifications/taskCompleted");
const snoozeTask = require("../../controllers/notifications/snoozetask");
const Adminnotification = require("../../controllers/notifications/adminremainder")
const sendEmail = require("../../controllers/notifications/sendemail")

router.post('/fetchdata', Spocnotification.fetchSpocnotification);
router.put('/taskcompleted/history-minutes', taskCompleted.taskCompleted);
router.put('/snooze/history-minutes', snoozeTask.SnoozeTask);
router.get('/admin/fetchdata', Adminnotification.fetchAdminnotification);
router.post('/send-email', sendEmail.sendEmail);

module.exports = router