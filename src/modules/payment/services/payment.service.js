
import stripe from "../../../config/stripe.js";

import {
  getCompletedRideForPaymentModel,
  getPaymentByRideModel,
  createPendingPaymentModel,
  saveStripeSessionModel,
  getRiderPaymentStatusModel,
} from "../models/payment.model.js";

const appUrl = process.env.FRONTEND_URL;

export const createRideCheckoutService = async ({
  rideId,
  riderId,
}) => {
  if (!rideId || !riderId) {
    const error = new Error("Ride ID and rider ID are required");
    error.statusCode = 400;
    throw error;
  }

  if (!appUrl) {
    throw new Error("FRONTEND_URL is missing");
  }

  const ride = await getCompletedRideForPaymentModel(
    rideId,
    riderId
  );

  if (!ride) {
    const error = new Error("Completed ride not found");
    error.statusCode = 404;
    throw error;
  }

  if (String(ride.status).toLowerCase() !== "completed") {
    const error = new Error(
      "Payment is available only after ride completion"
    );
    error.statusCode = 409;
    throw error;
  }

  if (String(ride.payment_status).toLowerCase() === "paid") {
    const error = new Error("This ride is already paid");
    error.statusCode = 409;
    throw error;
  }

  const amount = Number(ride.fare_amount);
  const amountPaise = Math.round(amount * 100);

  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !Number.isSafeInteger(amountPaise) ||
    amountPaise <= 0
  ) {
    const error = new Error("Invalid final fare");
    error.statusCode = 400;
    throw error;
  }

  let payment = await getPaymentByRideModel(rideId);

  if (payment?.status === "paid") {
    const error = new Error("This ride is already paid");
    error.statusCode = 409;
    throw error;
  }

  // Reuse an existing open Checkout Session.
  if (payment?.stripe_session_id) {
    const existingSession =
      await stripe.checkout.sessions.retrieve(
        payment.stripe_session_id
      );

    if (
      existingSession.status === "open" &&
      existingSession.url
    ) {
      return { checkoutUrl: existingSession.url };
    }

    if (existingSession.payment_status === "paid") {
      const error = new Error(
        "Payment confirmation is processing. Please refresh shortly."
      );
      error.statusCode = 409;
      throw error;
    }

    if (existingSession.status === "expired") {
      // The database must mark this attempt expired before
      // creating another one. Do not reuse the expired row.
      const error = new Error(
        "Previous checkout expired. Mark the old attempt expired before retrying."
      );
      error.statusCode = 409;
      throw error;
    }
  }

  if (payment && payment.status !== "pending") {
    payment = null;
  }

  if (!payment) {
    payment = await createPendingPaymentModel({
      rideId,
      riderId,
      amountPaise,
    });
  }

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      client_reference_id: rideId,
      metadata: {
        paymentId: String(payment.id),
        rideId: String(rideId),
        riderId: String(riderId),
      },
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "CabGo completed ride",
              description: `Ride ID: ${rideId}`,
            },
            unit_amount: amountPaise,
          },
          quantity: 1,
        },
      ],
      success_url:
  `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&ride_id=${encodeURIComponent(rideId)}`,
      cancel_url:
        `${appUrl}/payment/cancel?ride_id=${encodeURIComponent(rideId)}`,
    },
    {
      idempotencyKey: `cabgo-checkout-${payment.id}`,
    }
  );

  const savedPayment = await saveStripeSessionModel(
    payment.id,
    session.id
  );

  if (!savedPayment) {
    throw new Error("Unable to save Stripe Checkout Session");
  }

  return { checkoutUrl: session.url };
};

export const getRiderPaymentStatusService = async ({
  rideId,
  riderId,
}) => {
  if (!rideId || !riderId) {
    const error = new Error("Ride ID and rider ID are required");
    error.statusCode = 400;
    throw error;
  }

  const ride = await getCompletedRideForPaymentModel(
    rideId,
    riderId
  );

  if (!ride) {
    const error = new Error("Ride not found");
    error.statusCode = 404;
    throw error;
  }

  const payment = await getRiderPaymentStatusModel(
    rideId,
    riderId
  );

  return payment;
};
