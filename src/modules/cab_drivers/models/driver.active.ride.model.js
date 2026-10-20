


import pool from "../../../config/db.js";

export const getDriverActiveRideModel = async (driverId) => {
  const { rows } = await pool.query(
    `SELECT
       id,
       rider_id,
       driver_id,
       pickup_address,
       drop_address,
       fare_amount,
       status,
       created_at
     FROM public.rides
     WHERE driver_id = $1
       AND LOWER(status) IN ('accepted', 'in_progress', 'ongoing')
     ORDER BY created_at DESC
     LIMIT 1`,
    [driverId]
  );

  return rows[0] ?? null;
};