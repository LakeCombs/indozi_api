const { ONE_SIGNAL_CONFIG } = require("../config/notification.config");
const { json } = require("express");

async function send_notification(data, callback) {
	var headers = {
		"Content-Type": "application/json; charset=utf-8",
		Authorization: "Basic " + ONE_SIGNAL_CONFIG.API_KEY
	};

	var options = {
		host: "onesignal.com",
		post: 433,
		path: "/api/v1/notifications",
		method: "POST",
		headers: headers
	};

	var https = require("https");
	var req = https.request(options, function (res) {
		res.on("data", function (data) {
			console.log(JSON.parse(data));

			return callback(null, JSON.parse(data));
		});
	});

	req.on("error", function (error) {
		return callback({
			message: error
		});
	});

	req.write(JSON.stringify(data));
	req.end();
}

module.exports = { send_notification };
