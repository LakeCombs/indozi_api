const mongoose = require("mongoose");

const review_Schema = new mongoose.Schema(
	{
		review: { type: String, required: true },
		user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Review", review_Schema);
