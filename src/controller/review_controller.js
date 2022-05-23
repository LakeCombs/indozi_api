const Review = require("../model/review_model");
const Vendor = require("../model/vendor");

const create_review = async (req, res) => {
	try {
		const create_a_review = await Review.create({
			review: req.body.review,
			user_id,
			vendor_id
		});

		await Vendor.findByIdAndUpdate(
			vendor_id,
			{ $push: { reviews: create_a_review } },
			{ new: true }
		);

		return res.status(200).json(creat_a_review);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const find_all_review = async (req, res) => {
	try {
		const all_review = await Review.find();
		return res.status(200).json(all_review);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const get_all_review_by_vendor = async (req, res) => {
	try {
		const review_by_vendor = await Review.find({ vendor_id });
		return res.status(200).json(review_by_vendor);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const get_all_review_by_user = async (req, res) => {
	try {
		const review_by_user = await Review.find({ user_id });
		return res.status(200).json(review_by_user);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

module.exports = {
	create_review,
	find_all_review,
	get_all_review_by_vendor,
	get_all_review_by_user
};
