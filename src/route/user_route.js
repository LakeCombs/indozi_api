const express = require("express");
const {
	sign_up,
	verify_otp,
	edit_user_details,
	get_user_by_id,
	get_user_by_phone,
	change_password,
	create_password,
	login_user,
	favorite_a_vendor,
	remove_vendor_from_favorite
} = require("../controller/user_controller");

const user_route = express.Router();

user_route.route("/signup").post(sign_up);
user_route.route("/login").post(login_user);
user_route.route("/signup/verify").post(verify_otp);
user_route.route("/edit_user/:id").put(edit_user_details);
user_route.route("/:id").get(get_user_by_id);
user_route.route("/phone").get(get_user_by_phone);
user_route.route("/create_password").put(create_password);
user_route.route("/change_password").post(change_password);
user_route.route("/favorite_a_vendor").put(favorite_a_vendor);
user_route.route("/remove_vendor").put(remove_vendor_from_favorite);

module.exports = user_route;
