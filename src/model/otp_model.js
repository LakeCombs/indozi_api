const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const OtpSchema = new mongoose.Schema(
	{
		phone: { type: String, required: true },
		otp: {
			type: String,
			required: true
		},
		createdAt: { type: Date, default: Date.now, index: { expires: 300 } }
	},
	{ timestamps: true }
);

OtpSchema.methods.verifyOtp = async function (otp) {
	return await bcrypt.compare(otp, this.otp);
};

OtpSchema.pre("save", async function (next) {
	if (!this.isModified()) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.otp = await bcrypt.hash(this.otp, salt);
});

module.exports = mongoose.model("OTP", OtpSchema);
