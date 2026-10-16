
import pool from "../../../config/db.js";

export const getDriverDashboardStats = async (driverId) => {
  const query = `
    SELECT
      COUNT(*) FILTER (
        WHERE status = 'completed'
      ) AS completed_rides,

      COUNT(*) FILTER (
        WHERE status = 'cancelled'
      ) AS cancelled_rides,

      COALESCE(
        SUM(fare_amount) FILTER (
          WHERE status = 'completed'
        ), 0
      ) AS total_earnings,

      COUNT(*) FILTER (
        WHERE status = 'completed'
          AND created_at >= CURRENT_DATE
          AND created_at < CURRENT_DATE + INTERVAL '1 day'
      ) AS today_rides,

      COALESCE(
        SUM(fare_amount) FILTER (
          WHERE status = 'completed'
            AND created_at >= CURRENT_DATE
            AND created_at < CURRENT_DATE + INTERVAL '1 day'
        ), 0
      ) AS today_earnings

    FROM public.rides
    WHERE driver_id = $1;
  `;

  const result = await pool.query(query, [driverId]);

  return result.rows[0];
};
