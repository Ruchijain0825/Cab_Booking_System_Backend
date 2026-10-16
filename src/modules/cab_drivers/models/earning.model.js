
import pool from "../../../config/db.js";

export const getDriverEarnings = async (driverId) => {
  const query = `
    SELECT
      COALESCE(SUM(fare_amount) FILTER (WHERE status = 'completed'), 0) AS total_earnings,
      COUNT(*) FILTER (WHERE status = 'completed') AS completed_rides,
      COALESCE(AVG(fare_amount) FILTER (WHERE status = 'completed'), 0) AS average_fare
    FROM public.rides
    WHERE driver_id = $1;
  `;

  const { rows } = await pool.query(query, [driverId]);
  return rows[0];
};
