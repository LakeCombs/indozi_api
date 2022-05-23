const express = require("express");
const chat_route = require("../route/chat_route");
const message_route = require("../route/message_route");
const push_notification_route = require("../route/push_notification_route");
const service_routes = require("../route/services_route");
const task_route = require("../route/task_route");
const upload_photo_route = require("../route/upload_photo");
const user_route = require("../route/user_route");
const vendor_route = require("../route/vendor_route");
const send_mail = require("../services/email_service");

const v1 = express.Router();

v1.get("/", (req, res) => {
	res.status(200).send("welcome to indozi server 1.0.0");
});

v1.use("/user", user_route);
v1.use("/vendor", vendor_route);
v1.use("/task", task_route);
v1.use("/chat", chat_route);
v1.use("/message", message_route);
v1.use("/chat", chat_route);
v1.use("/service", service_routes);
v1.use("/notification", push_notification_route);
v1.use("/photo", upload_photo_route);

module.exports = v1;
