
import { getPendingRideRequests, acceptRideRequest, declineRideRequest } from "../models/riderequest.model.js";

export const getPendingRideRequestsService = async (driverId) => {
  if (!driverId) {
    const error = new Error("Driver ID is required");
    error.statusCode = 400;
    throw error;
  }

  return await getPendingRideRequests(driverId);
};

export const acceptRideRequestService = async (rideId, driverId) => {
  if (!rideId || !driverId) {
    const error = new Error("Ride ID and Driver ID are required");
    error.statusCode = 400;
    throw error;
  }

  const ride = await acceptRideRequest(rideId, driverId);
  if (!ride) {
    const error = new Error("Ride is unavailable or driver is offline");
    error.statusCode = 409;
    throw error;
  }

  return ride;
};

export const declineRideRequestService = async (rideId, driverId) => {
  if (!rideId || !driverId) {
    const error = new Error("Ride ID and Driver ID are required");
    error.statusCode = 400;
    throw error;
  }

  const result = await declineRideRequest(rideId, driverId);
  if (!result) {
    const error = new Error("Ride unavailable or already declined");
    error.statusCode = 409;
    throw error;
  }

  return result;
};
