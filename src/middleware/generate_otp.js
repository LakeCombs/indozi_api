const otpGenerator = require("otp-generator");

const gen_otp = otpGenerator.generate(4, {
	digits: true,
	upperCaseAlphabets: false,
	specialChars: false,
	lowerCaseAlphabets: false
});

module.exports = gen_otp;
