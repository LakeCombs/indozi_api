const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Vendor = require("../model/vendor");

const protect = async (req, res, next) => {
	let token;
	if (
		req.header.authorization &&
		req.header.authorization.startsWith("Bearer")
	) {
		try {
			token = req.header.authorization.split(" ")[1];
			const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decodeToken.id).select("-password");
			req.vendor = await Vendor.findById(decodeToken.id).select("-password");
			next();
		} catch (error) {
			res.status(401);
			throw new Error("Not authorized, token failed");
		}
	}

	if (!token) {
		res.status(401);
		throw new Error("Not authorized, not token");
	}
};

module.exports = protect;
