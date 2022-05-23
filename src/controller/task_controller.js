const Task = require("../model/task_model");
const Vendor = require("../model/vendor_model");
const User = require("../model/user_model");

const create_task = async (req, res) => {
	try {
		const { description } = req.body;

		if (!description) {
			res.status(401);
			throw new Error({ message: "Please enter a description" });
		}
		const creating_task = await Task.create(req.body);

		return res.status(200).json(creating_task);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const get_all_task = async (req, res) => {
	try {
		const all_task = await Task.find();
		return res.status(200).json(all_task);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};
const get_all_completed_task = async (req, res) => {
	try {
		const get_task = await Task.find({ completed: true });
		return res.status(200).json(get_task);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const get_all_task_by_vendor = async (req, res) => {
	const { vendor_id } = req.body;
	try {
		const vendor_task = await Task.find({ accepted_by: vendor_id });
		return res.status(200).json(vendor_task);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const get_all_completed_task_by_vendor = async (req, res) => {
	try {
		const completed_task_by_vendor = await Task.find({
			$and: [{ accepted_by: req.body.vendor_id }, { completed: true }]
		});

		return res.status(200).json(completed_task_by_vendor);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const get_all_task_by_user = async (req, res) => {
	try {
		const task_by_user = await Task.find({ created_by: req.body.user_id });
		return res.status(200).json({ task_by_user });
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const get_task_by_id = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id)
			.populate("user_id", "first_name last_name address phone pic")
			.populate("vendor_id", "first_name last_name phone rating")
			.populate("chat_id");
		return res.status(200).json(task);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const update_task = async (req, res) => {
	const { completed, user_comment } = req.body;
	try {
		const updating = await Task.findByIdAndUpdate(req.params.id, req.body, {
			new: true
		})
			.populate("user_id", "first_name last_name address phone pic")
			.populate("vendor_id", "first_name last_name phone rating")
			.populate("chat_id");

		if (completed === true) {
			await Vendor.findOneAndUpdate(
				{ _id: updating.vendor_id },
				{ $push: { completed_task: updating._id } },
				{ new: true }
			);
		}

		console.log();

		if (user_comment) {
			const user_details = await Vendor.findOneAndUpdate(
				{ _id: updating.vendor_id },
				{
					$push: {
						comments: {
							comment: user_comment,
							first_name: updating?.user_id?.first_name
						}
					}
				},
				{ new: true }
			);
		}

		return res.status(200).json(updating);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const rate_vendor = async (req, res) => {
	const { vendor_rating } = req.body;

	try {
		const rating_vendor = await Task.findByIdAndUpdate(
			req.params.id,
			vendor_rating,
			{
				new: true
			}
		);
		const all_vendor_task = await Task.find({
			vendor_id: rating_vendor.vendor_id
		});
		let total_vendor_rating = 0;
		for (let index = 0; index < all_vendor_task.length; index++) {
			total_vendor_rating += all_vendor_task[index].vendor_rating;
		}
		const average_vendor_rating = total_vendor_rating / all_vendor_task.length;
		const rateVendor = await Vendor.findOneAndUpdate(
			{ _id: rating_vendor.vendor_id },
			{ rating: average_vendor_rating },
			{ new: true }
		);

		return res.status(200).json(rating_vendor);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const vendor_accept_task = async (req, res) => {
	const { task_id, vendor_id } = req.body;
	if (!task_id || !vendor_id) {
		return res.status(404).json({ message: "Please log in and accept a task" });
	}

	const check_task_details = await Task.findOne({ _id: task_id });

	if (check_task_details && check_task_details.vendor_id != null) {
		return res
			.status(400)
			.json({ message: "This task has already been taken" });
	}

	try {
		const add_vendor_to_task = await Task.findOneAndUpdate(
			{ _id: task_id },
			{ vendor_id: req.body.vendor_id },
			{ new: true }
		)
			.populate("user_id", "first_name last_name address phone pic")
			.populate("vendor_id", "first_name last_name rating skill")
			.populate("chat_id");

		await Vendor.findOneAndUpdate(
			{ _id: vendor_id },
			{ $push: { accepted_task: task_id } },
			{ new: true }
		).populate();
		return res.status(201).json(add_vendor_to_task);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const vendor_request_completion = async (req, res) => {
	try {
		const updating = await Task.findByIdAndUpdate(
			req.params.id,
			{ vendor_request_for_completion: true },
			{
				new: true
			}
		)
			.populate("user_id", "first_name last_name address phone pic")
			.populate("vendor_id", "first_name last_name phone rating")
			.populate("chat_id");

		return res.status(201).json(updating);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const user_verify_completion = async (req, res) => {
	try {
		const updating = await Task.findByIdAndUpdate(
			req.params.id,
			{ user_verify_completion: true },
			{
				new: true
			}
		)
			.populate("user_id", "first_name last_name address phone pic")
			.populate("vendor_id", "first_name last_name phone rating")
			.populate("chat_id");

		return res.status(201).json(updating);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

module.exports = {
	create_task,
	get_all_task,
	get_all_completed_task,
	get_all_task_by_vendor,
	get_all_completed_task_by_vendor,
	get_all_task_by_user,
	get_task_by_id,
	rate_vendor,
	update_task,
	vendor_accept_task,
	vendor_request_completion,
	user_verify_completion
};
