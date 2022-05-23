const mongoose = require("mongoose");

const connectDb = async (req, res) => {
	try {
		const connect_to_db = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log(`Connected to: ${connect_to_db.connection.host}`);
	} catch (error) {
		console.log(`Connection Error: ${error.message}`);
		process.exit(1);
	}
};

module.exports = connectDb;
