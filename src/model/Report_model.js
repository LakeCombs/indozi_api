const mongoose = require("mongoose");

const report_Schema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }
	},
	{ timestamps: true }
);

module.exports = mongoose.Schema("Report", report_Schema);
