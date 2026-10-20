
import stripe from "../../../config/stripe.js";

import {
  createRideCheckoutService,
  getRiderPaymentStatusService,
} from "../services/payment.service.js";

import {
  markPaymentPaidModel,
  markPaymentFailedModel,
  getPaymentBySessionModel,
} from "../models/payment.model.js";

export const createRideCheckoutController = async (
  req,
  res,
  next
) => {
  try {
    const riderId = req.user?.userId;
    const { rideId } = req.params;

    if (!riderId) {
      return res.status(401).json({
        success: false,
        message: "Rider authentication required",
      });
    }

    const result = await createRideCheckoutService({
      rideId,
      riderId,
    });

    return res.status(200).json({
      success: true,
      checkoutUrl: result.checkoutUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const stripeWebhookController = async (req, res) => {
  console.log("🔥 Stripe webhook endpoint hit");
  console.log(
    "Signature exists:",
    !!req.headers["stripe-signature"]
  );
  console.log("Body is Buffer:", Buffer.isBuffer(req.body));

  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !signature) {
    return res.status(400).send("Missing webhook configuration");
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("Stripe signature verification failed:", error.message);
    return res.status(400).send("Invalid webhook signature");
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;

        if (session.payment_status !== "paid") {
          break;
        }

        // Confirm session matches the payment record and its amount.
        const payment = await getPaymentBySessionModel(session.id);

        if (!payment) {
          console.error("Payment record not found:", session.id);
          return res.status(500).send("Payment record not found");
        }

        if (
          session.currency !== "inr" ||
          session.amount_total !== Number(payment.amount_paise) ||
          session.metadata?.paymentId !== String(payment.id) ||
          session.metadata?.rideId !== String(payment.ride_id) ||
          session.metadata?.riderId !== String(payment.rider_id)
        ) {
          console.error("Stripe payment details do not match:", session.id);
          return res.status(400).send("Payment details mismatch");
        }

        const result = await markPaymentPaidModel({
          sessionId: session.id,
          paymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
        });

        if (!result.found) {
          return res.status(500).send("Unable to update payment");
        }

        break;
      }

      case "checkout.session.async_payment_failed":
      case "checkout.session.expired": {
        await markPaymentFailedModel(event.data.object.id);
        break;
      }

      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);
    return res.status(500).send("Webhook processing failed");
  }
};

export const getRiderPaymentStatusController = async (
  req,
  res,
  next
) => {
  try {
    const riderId = req.user?.userId;

    if (!riderId) {
      return res.status(401).json({
        success: false,
        message: "Rider authentication required",
      });
    }

    const payment = await getRiderPaymentStatusService({
      rideId: req.params.rideId,
      riderId,
    });

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
};
