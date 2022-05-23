const jwt = require("jsonwebtoken");

const generate_token = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const decode_token = (req, res) => {
	if (
		req.header.authorization &&
		req.header.authorization.startswith("Bearer")
	) {
		const token = req.headers.authorization.split(" ")[1];
		const decoding = jwt.verify(token, process.env.JWT_SECRET);
		return decoding.id;
		console.log(decoding);
	} else {
		return { message: "user not allowed" };
	}
};

module.exports = { generate_token, decode_token };
