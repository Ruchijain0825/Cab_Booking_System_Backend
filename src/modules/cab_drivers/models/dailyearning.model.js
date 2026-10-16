
import pool from "../../../config/db.js";

export const getDailyEarnings = async (driverId) => {
  const query = `
    SELECT
      DATE(created_at) AS earning_date,
      COALESCE(SUM(fare_amount), 0) AS daily_earnings,
      COUNT(*) AS completed_rides
    FROM public.rides
    WHERE driver_id = $1
      AND status = 'completed'
    GROUP BY DATE(created_at)
    ORDER BY earning_date DESC
    LIMIT 30;
  `;

  const { rows } = await pool.query(query, [driverId]);
  return rows;
};
