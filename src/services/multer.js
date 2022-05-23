const multer = require("multer");
const path = require("path");

const upload_to_cloudinary = multer({
	storage: multer.diskStorage({}),
	fileFilter: (req, file, cb) => {
		let ext = path.extname(file.originalname);
		if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
			cb(new Error("file type is not suported"), false);
			return;
		}

		cb(null, true);
	}
});

module.exports = upload_to_cloudinary;
