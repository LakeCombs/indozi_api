const express = require("express");
const {
	register_vendor,
	verify_otp,
	edit_vendor_details,
	get_all_vendor,
	get_vendor_by_skill,
	get_vendor_by_location,
	create_password,
	change_password,
	login_vendor,
	update_vendor_skill,
	remove_skill,
	find_vendor_by_category,
	find_vendor_by_skill_rating_category
} = require("../controller/vendor_controller");

const vendor_route = express.Router();

vendor_route.route("/signup").post(register_vendor);
vendor_route.route("/verify_otp").post(verify_otp);
vendor_route.route("/login").post(login_vendor);
vendor_route.route("/edit_vendor").put(edit_vendor_details);
vendor_route.route("/").get(get_all_vendor);
vendor_route.route("/skill").get(get_vendor_by_skill);
vendor_route.route("/location").get(get_vendor_by_location);
vendor_route.route("/create_password").put(create_password);
vendor_route.route("/change_password").post(change_password);
vendor_route.route("/update_skill").put(update_vendor_skill);
vendor_route.route("/remove_skill").put(remove_skill);
vendor_route.route("/find_vendor_by_category").get(find_vendor_by_category);
vendor_route.route("/deep_search").get(find_vendor_by_skill_rating_category);

module.exports = vendor_route;
