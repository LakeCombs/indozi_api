const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
	{
		phone: { type: String },
		first_name: { type: String },
		last_name: { type: String },
		rating: { type: Number },
		skills: [{ type: String }],
		accepted_task: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
		completed_task: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
		password: { type: String },
		level: { type: String, enum: ["Beginners", "Intermediate", "Expert"] },
		reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
		favorited_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		category: [{ type: String }],
		average_response_time: { type: String },
		average_price: { type: Number },
		pic: {
			type: String,
			default:
				"https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
		},
		reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],
		comments: [{ comment: String, first_name: String }]
	},
	{ timestamps: true }
);

vendorSchema.methods.matchPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Vendor", vendorSchema);
