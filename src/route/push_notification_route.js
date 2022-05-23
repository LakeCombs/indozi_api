const express = require("express");
const {
	send_push_notification,
	send_push_notification_to_device
} = require("../controller/push_notification_controller");

const push_notification_route = express.Router();

push_notification_route.post("/sendall", send_push_notification);
push_notification_route.post("/sendtodevice", send_push_notification_to_device);

module.exports = push_notification_route;
