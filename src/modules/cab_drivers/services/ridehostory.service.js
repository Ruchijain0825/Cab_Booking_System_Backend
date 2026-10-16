
import { getDriverRideHistory, getDriverRideById } from "../models/ridehostory.model.js";

export const getDriverRideHistoryService = async (driverId, limit = 20, offset = 0) => {
  if (!driverId) {
    const error = new Error("Driver ID is required");
    error.statusCode = 400;
    throw error;
  }

  const pageSize = Number(limit);
  const pageOffset = Number(offset);

  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100 ||
      !Number.isInteger(pageOffset) || pageOffset < 0) {
    const error = new Error("Invalid pagination parameters");
    error.statusCode = 400;
    throw error;
  }

  return await getDriverRideHistory(driverId, pageSize, pageOffset);
};

export const getDriverRideByIdService = async (rideId, driverId) => {
  if (!rideId || !driverId) {
    const error = new Error("Ride ID and Driver ID are required");
    error.statusCode = 400;
    throw error;
  }

  const ride = await getDriverRideById(rideId, driverId);

  if (!ride) {
    const error = new Error("Ride not found");
    error.statusCode = 404;
    throw error;
  }

  return ride;
};
