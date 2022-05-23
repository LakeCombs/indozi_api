const mongoose = require("mongoose");
const moment = require("moment");

var now = moment();

const messageModel = new mongoose.Schema(
	{
		user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
		message: { type: String, trim: true },
		assets: { type: String },
		chat_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Chat"
		},
		time_sent: {
			type: String,
			default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Message", messageModel);
