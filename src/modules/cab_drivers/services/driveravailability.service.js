
import { updateDriverAvailability, getDriverAvailability } from "../models/driveravailability.model.js";

export const updateDriverAvailabilityService = async (driverId, isOnline) => {
  if (!driverId) {
    const error = new Error("Driver ID is required");
    error.statusCode = 400;
    throw error;
  }

  if (typeof isOnline !== "boolean") {
    const error = new Error("isOnline must be true or false");
    error.statusCode = 400;
    throw error;
  }

  const driver = await updateDriverAvailability(driverId, isOnline);
  if (!driver) {
    const error = new Error("Driver not found");
    error.statusCode = 404;
    throw error;
  }

  return driver;
};

export const getDriverAvailabilityService = async (driverId) => {
  if (!driverId) {
    const error = new Error("Driver ID is required");
    error.statusCode = 400;
    throw error;
  }

  const driver = await getDriverAvailability(driverId);
  if (!driver) {
    const error = new Error("Driver not found");
    error.statusCode = 404;
    throw error;
  }

  return driver;
};
