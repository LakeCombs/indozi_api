const cloudinary = require("../config/cloudinary.config");
const Image = require("../model/image_model");

const upload_image = async (req, res) => {
	try {
		const result = await cloudinary.uploader.upload(req.file.path);
		let new_image = await Image.create({
			image: result.secure_url,
			cloudinary_id: result.public_id
		});

		res.status(200).json(new_image);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const delete_image = async (req, res) => {
	try {
		let image = await Image.findById(req.params.id);
		await cloudinary.uploader.destroy(image.cloudinary_id);
		await image.remove();
		res.status(201).json(image);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const get_image = async (req, res) => {
	try {
		const image = await Image.findById(req.params.id);
		res.status(200).json(image);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

const edit_image = async (req, res) => {
	try {
		let get_image = await Image.findById(req.params.id);
		// Delete image from cloudinary
		await cloudinary.uploader.destroy(get_image.cloudinary_id);
		// Upload image to cloudinary
		let result;
		if (req.file) {
			result = await cloudinary.uploader.upload(req.file.path);
		}
		const data = {
			image: result?.secure_url || get_image.avatar,
			cloudinary_id: result?.public_id || get_image.cloudinary_id
		};
		get_image = await Image.findByIdAndUpdate(req.params.id, data, {
			new: true
		});
		res.status(201).json(get_image);
	} catch (error) {
		return res.status(400).json({ message: error.message, status: false });
	}
};

module.exports = { upload_image, delete_image, edit_image, get_image };
