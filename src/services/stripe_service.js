const stripe_token = process.env.STRIPE_SECRET_API_KEY;
const stripe_public_token = process.env.STRIPE_PUBLIC_API_KEY;

const stripe = require("stripe")(stripe_token);

const pay_with_stripe = (req, res) => {
	const { name, email, amount, description } = req.body;
	if (!amount) {
		return res.status(400).json({ message: "please enter an amount" });
	}
	stripe.customers
		.create({
			email: email,
			source: stripe_public_token,
			name: name,
			address: {}
		})
		.then((customer) => {
			return stripe.charges.create({
				amount: amount,
				description: description,
				currency: "USD",
				customer: customer.id
			});
		})
		.then((charge) => {
			return res.status(200).json({ message: "success" });
		})
		.catch((err) => {
			return res
				.status(400)
				.json({ message: "Sorry an error occurred, please try again", err });
		});
};

module.exports = { pay_with_stripe };
