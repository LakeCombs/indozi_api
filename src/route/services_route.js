const { Router } = require("express");
const { pay_with_stripe } = require("../services/stripe_service");

const service_routes = Router();

// service_routes.post("/payment", pay_with_stripe);
// this route require a frontend to function

module.exports = service_routes;
