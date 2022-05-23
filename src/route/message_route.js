const express = require("express");
const {
	send_message,
	get_all_messages_in_a_chat
} = require("../controller/message_controller");

const message_route = express.Router();

message_route.route("/").post(send_message);
message_route.route("/:chat_id").get(get_all_messages_in_a_chat);

module.exports = message_route;
