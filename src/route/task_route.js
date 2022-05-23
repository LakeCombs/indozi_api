const express = require("express");
const {
	create_task,
	get_all_task,
	get_all_completed_task,
	get_all_task_by_vendor,
	get_all_task_by_user,
	get_task_by_id,
	rate_vendor,
	update_task,
	vendor_accept_task,
	vendor_request_completion,
	user_verify_completion
} = require("../controller/task_controller");

const task_route = express.Router();

task_route.put("/vendor_accept", vendor_accept_task);
task_route.route("/create").post(create_task);
task_route.route("/").get(get_all_task);
task_route.put("/:id", update_task);
task_route.route("/completed").get(get_all_completed_task);
task_route.route("/vendor").get(get_all_task_by_vendor);
task_route.route("/user").get(get_all_task_by_user);
task_route.route("/:id").get(get_task_by_id);
task_route.route("/rate_vendor/:id").put(rate_vendor);
task_route.route("/vendor_completion/:id").put(vendor_request_completion);
task_route.route("/user_completion/:id").put(user_verify_completion);

module.exports = task_route;
