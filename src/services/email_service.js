const nodemailer = require("nodemailer");

const send_mail = ({ to, subject, text }) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.NODEMAILER_EMAIL,
			pass: process.env.NODEMAILER_PASSWORD
		}
	});

	const mailOptions = {
		from: process.env.NODEMAILER_EMAIL,
		to: to,
		subject: subject,
		text: text
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("email send " + info.response);
		}
	});

	return;
};

module.exports = send_mail;
