
import { getDriverEarnings } from "../models/earning.model.js";

export const getDriverEarningsService = async (driverId) => {
  if (!driverId) {
    const error = new Error("Driver ID is required");
    error.statusCode = 400;
    throw error;
  }

  return await getDriverEarnings(driverId);
};
