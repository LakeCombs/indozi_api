const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
	{
		name: { type: String },
		user_id: { type: Schema.Types.ObjectId, ref: "User" },
		vendor_id: { type: Schema.Types.ObjectId, ref: "Vendor" },
		category: { type: String },
		budget: { type: Number },
		images: [{ type: String }],
		description: { type: String, required: true, minlength: 30 },
		user_verify_completion: { type: Boolean, default: false },
		vendor_request_for_completion: { type: Boolean, default: false },
		user_rating: { type: Number },
		user_comment: { type: String },
		vendor_comment: { type: String },
		images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
		vendor_rating: { type: Number },
		chat_id: { type: Schema.Types.ObjectId, ref: "Chat" }
	},
	{ timestamps: true }
);

module.exports = model("Task", taskSchema);
