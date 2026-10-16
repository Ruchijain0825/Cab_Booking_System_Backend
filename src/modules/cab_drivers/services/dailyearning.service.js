
import { getDailyEarnings } from "../models/dailyearning.model.js";

export const getDailyEarningsService = async (driverId) => {
  if (!driverId) {
    const error = new Error("Driver ID is required");
    error.statusCode = 400;
    throw error;
  }

  return await getDailyEarnings(driverId);
};
