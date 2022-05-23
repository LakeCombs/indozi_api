const gen_otp = require("../middleware/generate_otp");
const Vendor = require("../model/vendor_model");
const OTP = require("../model/otp_model");
const bcrypt = require("bcryptjs");
const { generate_token } = require("../middleware/generete_token");

const register_vendor = async (req, res) => {
	const vendor = await Vendor.findOne({ phone: req.body.phone });

	if (vendor) {
		return res.status(400).send("Vendor already registered");
	}
	gen_otp;
	console.log(gen_otp);
	const new_otp = new OTP({ phone: req.body.phone, otp: gen_otp });
	const result = await new_otp.save();
	return res.status(200).send("Otp send successfully!");
};

const verify_otp = async (req, res) => {
	const otp_holder = await OTP.findOne({ phone: req.body.phone }).sort({
		createdAt: -1
	});
	if (otp_holder?.length === 0) {
		return res.status(400).send("You use an expired OTP!");
	}

	if (
		otp_holder?.phone === req.body.phone &&
		(await otp_holder.verifyOtp(req.body.otp))
	) {
		const vendor = new Vendor({ phone: otp_holder.phone });
		const token = await generate_token(vendor._id);
		const result = await vendor.save();
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

const edit_vendor_details = async (req, res) => {
	try {
		const update = await Vendor.findByIdAndUpdate(
			req.body.vendor_id,
			req.body,
			{
				new: true
			}
		);

		return res.status(201).json(update);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

const get_all_vendor = async (req, res) => {
	try {
		const vendors = await Vendor.find();
		return res.status(200).json({ vendors, status: true });
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const get_vendor_by_skill = async (req, res) => {
	try {
		const vendors = await Vendor.find({
			skill: { $elemMatch: req.body.skill }
		});

		return res.status(200).json({ vendors, status: true });
	} catch (error) {
		res.status(400).json({ message: error.message, status: false });
	}
};

const get_vendor_by_location = async (req, res) => {
	try {
		const vendor_by_location = await Vendor.find({
			address: { $elemMatch: req.body.address }
		});
		return res.status(200).json({ vendor_by_location, status: true });
	} catch (error) {
		return res.status(400).json({ message: error, status: false });
	}
};

const create_password = async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hash_password = await bcrypt.hash(req.body.password, salt);
		const creating_password = await Vendor.findOneAndUpdate(
			{ phone: req.body.phone },
			{ password: hash_password },
			{ new: true }
		);

		return res.status(201).json(creating_password);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const change_password = async (req, res) => {
	const { vendor_id, old_password, new_password } = req.body;
	try {
		const vendor = await Vendor.findOne({ _id: vendor_id });
		const comfirm_old_password = await vendor.matchPassword(old_password);
		if (comfirm_old_password === false) {
			return res
				.status(404)
				.json({ message: "please enter your correct old password" });
		} else {
			const salt = await bcrypt.genSalt(10);
			vendor.password = await bcrypt.hash(req.body.new_password, salt);
			const update_vendor = await vendor.save();
			return res.status(201).json({
				user: update_vendor,
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

const login_vendor = async (req, res) => {
	const { phone, password } = req.body;
	if (!phone || !password) {
		return res
			.status(401)
			.json({ message: "Please enter your phone number and password" });
	} else {
		try {
			const vendor = await Vendor.findOne({ phone: phone });
			const verify_password = await vendor.matchPassword(password);
			console.log(verify_password);
			if (vendor && verify_password) {
				return res.status(200).json(vendor);
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

const update_vendor_skill = async (req, res) => {
	const { vendor_id, skill } = req.body;
	try {
		const update_skill = await Vendor.findOneAndUpdate(
			{ _id: vendor_id },
			{ $push: { skills: skill } },
			{ new: true }
		);
		return res
			.status(201)
			.json({ message: "skill added", vendor: update_skill });
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const remove_skill = async (req, res) => {
	const { vendor_id, skill } = req.body;
	try {
		const removing_skill = await Vendor.findOneAndUpdate(
			{ _id: vendor_id },
			{ $pull: { skills: skill } },
			{ new: true }
		);

		return res
			.status(201)
			.json({ message: "skill removed", vendor: removing_skill });
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

//this route uses the category and the skill to find a vendor
const find_vendor_by_category = async (req, res) => {
	try {
		const search = await Vendor.find({
			$or: [{ $elemMatch: req.body.category }, { $elemMatch: req.body.skill }]
		});
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

//this route search by skill, address, category, rating, level
//and will return any element that match either of them
const find_vendor_by_skill_rating_category = async (req, res, next) => {
	try {
		const deep_search = await Vendor.find({
			$or: [
				{ skill: { $in: [req.body.skill] } },
				{ $elemMatch: { address: req.body.address } },
				{ category: { $in: [req.body.category] } },
				{ rating: req.body.rating },
				{
					level: req.body.level
				}
			]
		});

		return res.status(200).json(deep_search);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

module.exports = {
	register_vendor,
	verify_otp,
	edit_vendor_details,
	get_all_vendor,
	get_vendor_by_skill,
	get_vendor_by_location,
	create_password,
	change_password,
	login_vendor,
	update_vendor_skill,
	remove_skill,
	find_vendor_by_category,
	find_vendor_by_skill_rating_category
};
