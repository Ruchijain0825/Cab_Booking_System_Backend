
import { getPendingRideRequests, acceptRideRequest, declineRideRequest,startRide,
  completeRide, } from "../models/riderequest.model.js";

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
export const startRideService = async (rideId, driverId) => {
  if (!rideId || !driverId) {
    const error = new Error("Ride ID and Driver ID are required");
    error.statusCode = 400;
    throw error;
  }

  const ride = await startRide(rideId, driverId);

  if (!ride) {
    const error = new Error(
      "Ride not found, not assigned to this driver, or not accepted"
    );
    error.statusCode = 409;
    throw error;
  }

  return ride;
};

export const completeRideService = async (rideId, driverId) => {
  if (!rideId || !driverId) {
    const error = new Error("Ride ID and Driver ID are required");
    error.statusCode = 400;
    throw error;
  }

  const ride = await completeRide(rideId, driverId);

  if (!ride) {
    const error = new Error(
      "Ride not found, not assigned to this driver, or not in progress"
    );
    error.statusCode = 409;
    throw error;
  }

  return ride;
};