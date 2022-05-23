const not_found = (req, res, next) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
};

const error_handler = (err, req, res, next) => {
	const status_code = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(status_code);
	res.json({
		message: err.message,
		stack: process.env.NODE_ENV === "production" ? null : err.stack
	});
};

module.exports = { not_found, error_handler };
