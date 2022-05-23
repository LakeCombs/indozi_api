const mongoose = require("mongoose");

const group_chat_model = mongoose.Schema(
	{
		chat_name: { type: String, trim: true },
		users: [{ type: mongoose.Schema.Type.ObjectId, ref: "User" }],
		messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
		latest_message: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message"
		}
	},
	{ timestamps: true }
);

module.exports = mongosoe.model("Group_Chat", group_chat_model);
