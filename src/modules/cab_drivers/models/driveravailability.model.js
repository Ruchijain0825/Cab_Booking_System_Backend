
import pool from "../../../config/db.js";

export const updateDriverAvailability = async (driverId, isOnline) => {
  const { rows } = await pool.query(
    `UPDATE public.cab_drivers SET is_online = $2 WHERE id = $1 RETURNING id, is_online`,
    [driverId, isOnline]
  );
  return rows[0] ?? null;
};

export const getDriverAvailability = async (driverId) => {
  const { rows } = await pool.query(
    `SELECT id, is_online FROM public.cab_drivers WHERE id = $1 LIMIT 1`,
    [driverId]
  );
  return rows[0] ?? null;
};
