const { Router } = require("express");
const {
	upload_image,
	delete_image,
	edit_image,
	get_image
} = require("../controller/image_controller");
const upload_to_cloudinary = require("../services/multer");

const upload_photo_route = Router();

upload_photo_route.post(
	"/",
	upload_to_cloudinary.single("image"),
	upload_image
);
upload_photo_route.delete("/:id", delete_image);
upload_photo_route.put(
	"/:id",
	upload_to_cloudinary.single("image"),
	edit_image
);
upload_photo_route.get("/", get_image);

module.exports = upload_photo_route;
