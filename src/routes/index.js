import express from "express";
import { login, signup } from "../controller/user-controller.js";
import { createOrder } from "../controller/order-controller.js";
import { authenticate } from "../middlewares/authentication.js";

const router = express.Router();

// User's routes
router.post("/signup", signup);
router.post("/login", login);


// Order's routes
router.post("/create-order", authenticate, createOrder);

export default router;