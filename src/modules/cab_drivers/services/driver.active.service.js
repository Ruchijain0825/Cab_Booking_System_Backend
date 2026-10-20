
import { getDriverActiveRideModel } from "../models/driver.active.ride.model.js";

export const getDriverActiveRideService = async (driverId) => {
  if (!driverId) {
    const error = new Error("Driver ID is required");
    error.statusCode = 400;
    throw error;
  }

  return getDriverActiveRideModel(driverId);
};
