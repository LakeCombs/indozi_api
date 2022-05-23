const mongoose = require("mongoose");
const generate_token = require("../middleware/generete_token");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
	{
		first_name: { type: String },
		last_name: { type: String },
		phone: { type: String },
		password: { type: String },
		address: { type: String },
		coupon_code: { type: String },
		favorite_vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
		task: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
		pic: {
			type: String,
			default:
				"https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
		}
	},
	{ timestamps: true }
);

UserSchema.methods.matchPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
