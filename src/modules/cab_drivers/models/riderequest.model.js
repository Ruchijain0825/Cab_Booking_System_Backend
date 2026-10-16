
import pool from "../../../config/db.js";


export const getPendingRideRequests = async (driverId) => {
  const query = `
    SELECT r.id, r.rider_id, r.pickup_address, r.drop_address,
           r.fare_amount, r.status, r.created_at
    FROM public.rides r
    JOIN public.cab_drivers d ON d.id = $1
    WHERE d.is_online = TRUE
      AND r.status = 'requested'
      AND r.driver_id IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.ride_declines rd
        WHERE rd.ride_id = r.id AND rd.driver_id = $1
      )
    ORDER BY r.created_at DESC
    LIMIT 20;
  `;

  const { rows } = await pool.query(query, [driverId]);
  return rows;
};


export const acceptRideRequest = async (rideId, driverId) => {
  const query = `
    UPDATE public.rides AS r
    SET driver_id = $2, status = 'accepted'
    WHERE r.id = $1
      AND r.status = 'requested'
      AND r.driver_id IS NULL
      AND EXISTS (
        SELECT 1 FROM public.cab_drivers AS d
        WHERE d.id = $2 AND d.is_online = TRUE
      )
    RETURNING r.*;
  `;

  const { rows } = await pool.query(query, [rideId, driverId]);
  return rows[0] ?? null;
};

export const declineRideRequest = async (rideId, driverId) => {
  const query = `
    INSERT INTO public.ride_declines (ride_id, driver_id)
    SELECT r.id, d.id
    FROM public.rides r
    JOIN public.cab_drivers d ON d.id = $2
    WHERE r.id = $1
      AND r.status = 'requested'
      AND r.driver_id IS NULL
      AND d.is_online = TRUE
    ON CONFLICT (ride_id, driver_id) DO NOTHING
    RETURNING ride_id, driver_id, declined_at;
  `;

  const { rows } = await pool.query(query, [rideId, driverId]);
  return rows[0] ?? null;
};