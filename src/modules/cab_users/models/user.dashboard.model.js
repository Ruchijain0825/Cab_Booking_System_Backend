
import pool from "../../../config/db.js";

// 1. Get available drivers
export const getAvailableDriversModel = async () => {
  const result = await pool.query(
    `SELECT id, name, vehicle_type, vehicle_number, is_online
     FROM public.cab_drivers
     WHERE is_online = TRUE
     ORDER BY id`
  );

  return result.rows;
};

// 2. Create a ride
export const createRideModel = async ({
  userId,
  driverId,
  pickupLocation,
  pickupLatitude,
  pickupLongitude,
  dropLocation,
  dropLatitude,
  dropLongitude,
  fareAmount,
}) => {
  const query = `
    INSERT INTO public.rides (
      rider_id,
      driver_id,
      pickup_address,
      pickup_latitude,
      pickup_longitude,
      drop_address,
      drop_latitude,
      drop_longitude,
      fare_amount,
      status
    )
    SELECT
      $1, d.id, $3, $4, $5, $6, $7, $8, $9, 'requested'
    FROM public.cab_drivers d
    WHERE d.id = $2
      AND d.is_online = TRUE
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    userId,
    driverId,
    pickupLocation,
    pickupLatitude ?? null,
    pickupLongitude ?? null,
    dropLocation,
    dropLatitude ?? null,
    dropLongitude ?? null,
    fareAmount,
  ]);

  if (!rows[0]) {
    const error = new Error(
      "Selected driver is unavailable or offline"
    );
    error.statusCode = 409;
    throw error;
  }

  return rows[0];
};

// 3. Get user's ride history
export const getRideHistoryModel = async (userId) => {
  const result = await pool.query(
    `SELECT *
     FROM public.rides
     WHERE rider_id = $1
     ORDER BY created_at DESC
     LIMIT 50`,
    [userId]
  );

  return result.rows;
};

// 4. Get user's active ride
export const getActiveRideModel = async (userId) => {
  const result = await pool.query(
    `SELECT *
     FROM public.rides
     WHERE rider_id = $1
       AND LOWER(status) IN ('requested', 'accepted', 'ongoing')
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );

  return result.rows[0] ?? null;
};

// 5. Get ride details belonging to this customer
export const getRideByIdModel = async (rideId, userId) => {
  const result = await pool.query(
    `SELECT *
     FROM public.rides
     WHERE id = $1 AND rider_id = $2`,
    [rideId, userId]
  );

  return result.rows[0] ?? null;
};

// 6. Get a ride for chat authorization
export const getRideForChatModel = async (rideId) => {
  const result = await pool.query(
    `SELECT id, rider_id, driver_id, status
     FROM public.rides
     WHERE id = $1`,
    [rideId]
  );

  return result.rows[0] ?? null;
};

// 7. Save a chat message
// 7. Save a chat message



export const createRideMessageModel = async ({
  rideId,
  senderType,
  senderId,
  message,
}) => {
  const result = await pool.query(
    `INSERT INTO public.ride_messages (
       ride_id,
       sender_type,
       sender_id,
       message
     )
     VALUES ($1, $2, $3, $4)
     RETURNING id, ride_id, sender_type, sender_id, message, created_at`,
    [rideId, senderType, senderId, message]
  );

  return result.rows[0];
};

// 8. Get messages for a ride
export const getRideMessagesModel = async (rideId) => {
  const result = await pool.query(
    `SELECT id, ride_id, sender_type, sender_id, message, created_at
     FROM public.ride_messages
     WHERE ride_id = $1
     ORDER BY created_at ASC
     LIMIT 200`,
    [rideId]
  );

  return result.rows;
};
