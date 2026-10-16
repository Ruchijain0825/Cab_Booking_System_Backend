
import pool from "../../../config/db.js";

export const getDriverRideHistory = async (driverId, limit = 20, offset = 0) => {
  const query = `
    SELECT id, rider_id, pickup_address, drop_address, fare_amount,
           status, created_at
    FROM public.rides
    WHERE driver_id = $1
      AND status IN ('completed', 'cancelled')
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
  `;

  const { rows } = await pool.query(query, [driverId, limit, offset]);
  return rows;
};

export const getDriverRideById = async (rideId, driverId) => {
  const query = `
    SELECT id, rider_id, pickup_address, drop_address, fare_amount,
           status, created_at
    FROM public.rides
    WHERE id = $1 AND driver_id = $2
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [rideId, driverId]);
  return rows[0] ?? null;
};
