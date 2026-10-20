
import pool from "../../../config/db.js";
export const getDriverRideForChatModel = async (rideId, driverId) => {
  const { rows } = await pool.query(
    `SELECT id, rider_id, driver_id, status
     FROM public.rides
     WHERE id = $1
       AND driver_id = $2
     LIMIT 1`,
    [rideId, driverId]
  );

  return rows[0] ?? null;
};

// Get messages for this ride
export const getDriverRideMessagesModel = async (rideId) => {
  const { rows } = await pool.query(
    `SELECT id, ride_id, sender_type, sender_id, message, created_at
     FROM public.ride_messages
     WHERE ride_id = $1
     ORDER BY created_at ASC
     LIMIT 200`,
    [rideId]
  );

  return rows;
};

// Save driver's message
export const createDriverRideMessageModel = async ({
  rideId,
  driverId,
  message,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO public.ride_messages (
       ride_id, sender_type, sender_id, message
     )
     VALUES ($1, 'DRIVER', $2, $3)
     RETURNING id, ride_id, sender_type, sender_id, message, created_at`,
    [rideId, driverId, message]
  );

  return rows[0];
};