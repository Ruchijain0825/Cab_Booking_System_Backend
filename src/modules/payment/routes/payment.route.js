import express from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import {
  createRideCheckoutController,
  stripeWebhookController,
  getRiderPaymentStatusController
} from "../controllers/payment.controller.js";

const router = express.Router();

// Stripe sends the webhook to this endpoint.
// It must receive the raw body, not parsed JSON.
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController
);

// Rider-authenticated checkout endpoint.
router.post(
  "/rides/:rideId/checkout",
  authMiddleware,
  express.json(),
  createRideCheckoutController
);
router.get(
  "/rides/:rideId/status",
  authMiddleware,
  getRiderPaymentStatusController
);

export default router;