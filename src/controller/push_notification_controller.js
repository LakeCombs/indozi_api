const { ONE_SIGNAL_CONFIG } = require("../config/notification.config");
const { send_notification } = require("../services/push_notification_service");

exports.send_push_notification = (req, res, next) => {
	var message = {
		app_id: process.env.APP_ID,
		contents: { en: "Testing push notification" },
		included_segments: ["ALL"],
		content_available: true,
		small_icon: "ic_notification_icon",
		data: {
			PushTitle: "CUSTOM NOTIFICATION"
		}
	};

	send_notification(message, (error, results) => {
		if (error) {
			return next(error);
		}
		return res.status(200).send({ message: "Success", data: results });
	});
};

exports.send_push_notification_to_device = (req, res, next) => {
	var message = {
		app_id: process.e.APP_ID,
		contents: { en: "Testing push notification" },
		included_segments: ["included_player_ids"],
		include_player_ids: req.body.devices,
		content_available: true,
		small_icon: "ic_notification_icon",
		data: {
			PushTitle: "CUSTOM NOTIFICATION"
		}
	};

	send_notification(message, (error, results) => {
		if (error) {
			return next(error);
		}
		return res.status(200).send({ message: "Success", data: results });
	});
};
