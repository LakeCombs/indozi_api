const User = require("../model/user_model");
const Vendor = require("../model/vendor_model");
const Chat = require("../model/chat_model");
const mongoose = require("mongoose");

const access_chat = async (req, res) => {
	const { user_id, vendor_id } = req.body;
	if (!user_id || !vendor_id) {
		return res
			.status(400)
			.json({ message: "user_id params is not send with request" });
	}

	const check_for_your_chat = await Chat.find({
		$or: [
			{
				user_id: user_id
			},
			{
				vendor_id: vendor_id
			}
		]
	})
		.populate("user_id", "first_name last_name pic")
		.populate("vendor_id", "first_name last_name pic")
		.populate("latest_message");

	if (check_for_your_chat.length > 0) {
		res.status(200).json(check_for_your_chat);
	} else {
		var chat_data = {
			chat_name: "sender",
			user_id: req.body.user_id,
			vendor_id: req.body.vendor_id
		};

		try {
			const create_chat = await Chat.create(chat_data);
			const full_chat = await Chat.findOne({ _id: create_chat._id })
				// .populate("user_id", "first_name last_name pic")
				// .populate("vendor_id", "first_name last_name pic")
				.populate("messages")
				.populate("latest_message", "first_name last_name message")
				.exec();

			res.status(200).send(full_chat);
		} catch (error) {
			res.status(400).json({ message: error.message, status: false });
		}
	}
};

const fetch_a_chat = async (req, res) => {
	try {
		const single_user_chat = await Chat.findById(req.params.id)
			.populate("user_id", "first_name last_name pic")
			.populate("vendor_id", "first_name last_name pic")
			.populate("latest_message");

		res.status(200).json(single_user_chat);
	} catch (error) {
		res.status(400).json({ message: error.message, status: false });
	}
};

module.exports = {
	access_chat,
	fetch_a_chat
};
