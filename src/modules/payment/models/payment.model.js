import pool from "../../../config/db.js";

export const getCompletedRideForPaymentModel = async (
  rideId,
  riderId
) => {
  const { rows } = await pool.query(
    `SELECT id, rider_id, status, fare_amount, payment_status
     FROM public.rides
     WHERE id = $1 AND rider_id = $2
     LIMIT 1`,
    [rideId, riderId]
  );

  return rows[0] ?? null;
};

export const getPaymentByRideModel = async (rideId) => {
  const { rows } = await pool.query(
    `SELECT *
     FROM public.payments
     WHERE ride_id = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [rideId]
  );

  return rows[0] ?? null;
};

export const createPendingPaymentModel = async ({
  rideId,
  riderId,
  amountPaise,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO public.payments
       (ride_id, rider_id, amount_paise, currency, status)
     VALUES ($1, $2, $3, 'inr', 'pending')
     RETURNING *`,
    [rideId, riderId, amountPaise]
  );

  return rows[0];
};

export const saveStripeSessionModel = async (
  paymentId,
  sessionId
) => {
  const { rows } = await pool.query(
    `UPDATE public.payments
     SET stripe_session_id = $2, updated_at = NOW()
     WHERE id = $1 AND status = 'pending'
     RETURNING *`,
    [paymentId, sessionId]
  );

  return rows[0] ?? null;
};

export const markPaymentPaidModel = async ({
  sessionId,
  paymentIntentId,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `SELECT id, ride_id, status
       FROM public.payments
       WHERE stripe_session_id = $1
       FOR UPDATE`,
      [sessionId]
    );

    const payment = result.rows[0];

    // Unknown session: do not update any ride.
    if (!payment) {
      await client.query("ROLLBACK");
      return { found: false };
    }

    // Webhook may be delivered more than once.
    if (payment.status === "paid") {
      await client.query("COMMIT");
      return { found: true, alreadyPaid: true };
    }

    await client.query(
      `UPDATE public.payments
       SET status = 'paid',
           stripe_payment_intent_id = $2,
           paid_at = NOW(),
           updated_at = NOW()
       WHERE id = $1 AND status = 'pending'`,
      [payment.id, paymentIntentId]
    );

    // If this column exists in your rides table, sync it too.
    await client.query(
      `UPDATE public.rides
       SET payment_status = 'paid'
       WHERE id = $1`,
      [payment.ride_id]
    );

    await client.query("COMMIT");

    return { found: true, alreadyPaid: false };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const markPaymentFailedModel = async (sessionId) => {
  await pool.query(
    `UPDATE public.payments
     SET status = 'failed', updated_at = NOW()
     WHERE stripe_session_id = $1
       AND status = 'pending'`,
    [sessionId]
  );
};
export const getRiderPaymentStatusModel = async (rideId, riderId) => {
  const { rows } = await pool.query(
    `SELECT id, ride_id, status, amount_paise, currency, paid_at
     FROM public.payments
     WHERE ride_id = $1 AND rider_id = $2
     ORDER BY created_at DESC
     LIMIT 1`,
    [rideId, riderId]
  );

  return rows[0] ?? null;
};
export const getPaymentBySessionModel = async (sessionId) => {
  const { rows } = await pool.query(
    `SELECT id, ride_id, rider_id, amount_paise, currency,
            status, stripe_session_id
     FROM public.payments
     WHERE stripe_session_id = $1
     LIMIT 1`,
    [sessionId]
  );

  return rows[0] ?? null;
};