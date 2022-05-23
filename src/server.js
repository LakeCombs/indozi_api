const express = require("express");
require("dotenv/config");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const v1 = require("./version/v1");
const connectDb = require("./config/connectDB");
const bodyParser = require("body-parser");
const {
	not_found,
	error_handler
} = require("./middleware/error_handling_middleware");
const PORT = process.env.PORT || 3000;
const admin = require("firebase-admin");

connectDb();

app
	.use(express.json())
	.use(cors())
	.use(morgan("tiny"))
	.use(helmet())
	.use("/api/v1", v1)
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: false }));

app.use(not_found).use(error_handler);

const application_server = server.listen(PORT, function () {
	console.log(`server is listening on ${PORT}`);
});

process.on("SIGTERM", () => {
	application_server.close(() => {
		console.log("Process terminated");
	});
});

const io = require("socket.io")(application_server, {
	pingTimeout: 600000,

	cors: {
		origin: "http://localhost:3000"
	}
});

io.on("connection", (socket) => {
	console.log("connected to the socket.io server");

	socket.on("setup", (user_data) => {
		socket.join(user_data._id);
		socket.emit("connected");
	});

	socket.on("join room", (room) => {
		socket.join(room);
		console.log("user join room : " + room);
	});

	socket.on("typing", (room) => socket.in(room).emit("typing"));
	socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

	socket.on("new message", (new_message_recieved) => {
		var chat = new_message_recieved.chat;

		if (!chat.users) return console.log("chat.users not defined");
		chat.users.forEach((user) => {
			if (user._id == new_message_recieved.sender._id) return;
			socket.in(user._id).emit("message recieved", new_message_recieved);
		});
	});

	socket.off("setup", () => {
		console.log("User disconnected");
		socket.leave(user_data._id);
	});
});
