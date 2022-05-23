const account_sid = process.env.TWILIO_ACCOUNT_SID;
const account_auth = process.env.TWILIO_AUTH_TOKEN;
const phone_number = process.env.TWILIO_PHONE_NUMBER;

const client = require("twilio")(account_sid, account_auth);

const send_otp = ({ OTP, phone }) => {
	client.messages
		.create({
			to: phone,
			// from: process.env.phone_number,
			from: "+2348168566761",
			body: `your indozi OTP is ${OTP}, it expires in 5 minute`
		})
		.then((message) => console.log("send_otp", message.sid));

	console.log("the sent otp", OTP);
};

module.exports = send_otp;

//the
