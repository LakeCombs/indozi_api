const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
	{
		task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
		chat_name: { type: String, trim: true },
		user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
		messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
		latest_message: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message"
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Chat", chatModel);
