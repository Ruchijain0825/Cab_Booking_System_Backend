
import pool from "../../../config/db.js";
export const getDriverEarnings = async (driverId) => {
  const query = `
    SELECT
      COALESCE(
        SUM(fare_amount) FILTER (
          WHERE status = 'completed'
        ), 0
      ) AS total_earnings,

      COUNT(*) FILTER (
        WHERE status = 'completed'
      ) AS completed_rides,

      COALESCE(
        ROUND(
          AVG(fare_amount) FILTER (
            WHERE status = 'completed'
          ), 2
        ), 0
      ) AS average_fare,

      COALESCE(
        SUM(fare_amount) FILTER (
          WHERE status = 'completed'
            AND created_at >= CURRENT_DATE
            AND created_at < CURRENT_DATE + INTERVAL '1 day'
        ), 0
      ) AS today_earnings,

      COUNT(*) FILTER (
        WHERE status = 'completed'
          AND created_at >= CURRENT_DATE
          AND created_at < CURRENT_DATE + INTERVAL '1 day'
      ) AS today_rides

    FROM public.rides
    WHERE driver_id = $1;
  `;

  const { rows } = await pool.query(query, [driverId]);
  return rows[0];
};