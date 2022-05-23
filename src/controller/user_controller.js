const bcrypt = require("bcryptjs");
const axios = require("axios");
const User = require("../model/user_model");
const Vendor = require("../model/vendor_model");
const OTP = require("../model/otp_model");
const { generate_token } = require("../middleware/generete_token");
const gen_otp = require("../middleware/generate_otp");
const send_otp = require("../services/send_sms");

const sign_up = async (req, res) => {
	const user = await User.findOne({ phone: req.body.phone });

	if (user) {
		return res.status(400).send("User already registered");
	}

	send_otp({ OTP: gen_otp, phone: req.body.phone });
	const new_otp = new OTP({ phone: req.body.phone, otp: gen_otp });
	const result = await new_otp.save();
	return res.status(200).send("Otp send successfully!");
};

const verify_otp = async (req, res) => {
	const otp_holder = await OTP.findOne({ phone: req.body.phone }).sort({
		createdAt: -1
	});

	if ((otp_holder.length = 0 || null)) {
		return res.status(400).send("You use an expired OTP!");
	}

	if (
		otp_holder.phone === req.body.phone &&
		(await otp_holder.verifyOtp(req.body.otp))
	) {
		const user = new User({ phone: otp_holder.phone });
		const token = await generate_token(user._id);
		const result = await user.save();
		const delete_otp = await OTP.deleteMany({ phone: otp_holder.phone });

		return res.status(200).send({
			message: "User registration Successfull!",
			token: token,
			data: result
		});
	} else {
		return res.status(400).send("Your otp is wrong");
	}
};

const edit_user_details = async (req, res) => {
	try {
		const getTheUserDetails = await User.findOne({ _id: req.params.id });
		const update = await User.findByIdAndUpdate(
			getTheUserDetails._id,
			{ first_name: req.body.first_name, last_name: req.body.last_name },
			{ new: true }
		);

		return res.status(201).json(update);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

const get_all_user = async (req, res) => {
	try {
		const all_user = await User.find();
		return res.status(200).json(all_user);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

const get_user_by_id = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		return res.status(200).json(user);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const get_user_by_phone = async (req, res) => {
	try {
		const user = await User.findOne({ phone: req.body.phone });
		return res.status(200).json({ user, status: true });
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const create_password = async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hash_password = await bcrypt.hash(req.body.password, salt);
		const creating_password = await User.findOneAndUpdate(
			req.body.user_id,
			{ password: hash_password },
			{ new: true }
		);

		return res.status(201).json(creating_password);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const change_password = async (req, res) => {
	const { user_id, old_password, new_password } = req.body;
	try {
		const user = await User.findOne({ _id: user_id });
		const comfirm_old_password = await user.matchPassword(old_password);
		if (comfirm_old_password === false) {
			return res
				.status(404)
				.json({ message: "please enter your correct old password" });
		} else {
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(req.body.new_password, salt);
			console.log(user.password);
			const update_user = await user.save();
			return res.status(201).json({
				user: update_user,
				message: "your password have been updated"
			});
		}

		return res
			.status(400)
			.json({ message: "sorry an error occured while updating your password" });
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const login_user = async (req, res) => {
	const { phone, password } = req.body;
	if (!phone || !password) {
		return res
			.status(401)
			.json({ message: "Please enter your phone number and password" });
	} else {
		try {
			const user = await User.findOne({ phone: phone });
			const verify_password = await user.matchPassword(password);
			console.log(verify_password);
			if (user && verify_password) {
				return res.status(200).json(user);
			} else {
				return res
					.status(404)
					.json({ message: "Incorrect phone number or password" });
			}
		} catch (error) {
			return res.status(400).json({ message: error.message, status: false });
		}
	}
};

const favorite_a_vendor = async (req, res) => {
	const { vendor_id, user_id } = req.body;
	try {
		const check_if_vendor_already_in_vavorite = await User.findOne({
			favorite_vendors: { $in: [vendor_id] }
		});

		if (check_if_vendor_already_in_vavorite) {
			return res
				.status(400)
				.json({ message: "vendor is already in your favorite" });
		}
		const favorite_vendor = await User.findByIdAndUpdate(
			user_id,
			{
				$push: { favorite_vendors: vendor_id }
			},
			{ new: true }
		);

		await Vendor.findByIdAndUpdate(
			{ _id: vendor_id },
			{
				$push: { favorited_by: user_id }
			},
			{ new: true }
		);

		return res.status(201).json(favorite_vendor);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const remove_vendor_from_favorite = async (req, res) => {
	const { vendor_id, user_id } = req.body;

	try {
		const remove_vendor = await User.findOneAndUpdate(
			user_id,
			{ $pull: { favorite_vendors: vendor_id } },
			{ new: true }
		);

		await Vendor.findByIdAndUpdate(
			{ _id: vendor_id },
			{
				$pull: { favorited_by: user_id }
			},
			{ new: true }
		);

		return res.status(201).json(remove_vendor);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

module.exports = {
	verify_otp,
	sign_up,
	edit_user_details,
	get_all_user,
	get_user_by_id,
	get_user_by_phone,
	change_password,
	create_password,
	login_user,
	favorite_a_vendor,
	remove_vendor_from_favorite
};
