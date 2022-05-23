const { Router } = require("express");
const { access_chat, fetch_a_chat } = require("../controller/chat_controller");

const chat_route = Router();

chat_route.route("/").post(access_chat);
chat_route.route("/:id").get(fetch_a_chat);

module.exports = chat_route;
