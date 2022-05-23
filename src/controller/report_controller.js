const Report = require("../model/review_model");
const Vendor = require("../model/vendor_model");

const create_report = async (req, res) => {
	try {
		const creating_report = await Report.create({
			title: req.body.title,
			description: req.body.description,
			user_id: req.body.user_id,
			vendor_id: req.body.vendor_id
		});

		await Report.findByIdAndUpdate(
			vendor_id,
			{ $push: { reports: creating_report } },
			{ new: true }
		);

		return res.status(200).json(creat_a_review);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const find_all_report = async (req, res) => {
	try {
		const all_report = await Report.find();
		return res.status(200).json(all_report);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const get_all_report_by_vendor = async (req, res) => {
	try {
		const report_by_vendor = await Report.find({ vendor_id });
		return res.status(200).json(report_by_vendor);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const get_all_report_by_user = async (req, res) => {
	try {
		const review_by_user = await Report.find({ user_id });
		return res.status(200).json(review_by_user);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

module.exports = {
	create_report,
	find_all_report
	get_all_report_by_vendor,
	get_all_report_by_user
};
