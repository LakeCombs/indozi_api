const mongoose = require("mongoose");

const image_schema = new mongoose.Schema({
	image: {
		type: String
	},
	cloudinary_id: {
		type: String
	}
});

module.exports = mongoose.model("Image", image_schema);
