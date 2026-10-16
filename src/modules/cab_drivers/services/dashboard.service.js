import { getDriverDashboardStats } from "../models/dashboard.model.js";

export const getDriverDashboard = async (driverId) => {
  if (!driverId) throw new Error("Driver ID is required");

  const stats = await getDriverDashboardStats(driverId);

  return {
    completedRides: Number(stats.completed_rides),
    cancelledRides: Number(stats.cancelled_rides),
    totalEarnings: Number(stats.total_earnings),
    todayRides: Number(stats.today_rides),
    todayEarnings: Number(stats.today_earnings),
  };
};