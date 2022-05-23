const User = require("../model/user_model");
const Vendor = require("../model/vendor_model");
const Chat = require("../model/chat_model");
const Message = require("../model/message_model");

const send_message = async (req, res) => {
	const { message, chat_id } = req.body;

	if (!message || !chat_id) {
		return res
			.status(400)
			.json({ message: "Invalid data passed into request" });
	}

	var new_message = {
		user_id: req.body.user_id,
		vendor_id: req.body.vendor_id,
		message: message,
		chat_id: chat_id
	};
	try {
		var send_message = await Message.create(new_message);

		const get_message = await Message.findById(send_message._id)
			.populate("user_id", "first_name last_name pic")
			.populate("vendor_id", "first_name last_name pic");

		await Chat.findByIdAndUpdate(req.body.chat_id, {
			latest_message: send_message._id,
			$push: { messages: get_message._id }
		});

		var get_this_chat = await Chat.findOne({ _id: chat_id }).populate(
			"messages",
			"user_id vendor_id time_sent message"
		);

		res.status(200).json(get_this_chat);
	} catch (error) {
		res.status(400).json({ message: error.message, status: false });
	}
};

const get_all_messages_in_a_chat = async (req, res) => {
	try {
		const messages = await Message.find({ chat_id: req.params.chat_id })
			.populate("user_id", "first_name last_name pic")
			.populate("vendor_id", "first_name last_name pic");

		res.status(200).json(messages);
	} catch (error) {
		res.status(400).json({ message: error.message, status: false });
	}
};

module.exports = { send_message, get_all_messages_in_a_chat };
