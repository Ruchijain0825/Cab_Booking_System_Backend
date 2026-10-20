
import {
  getDriverRideForChatModel,
  getDriverRideMessagesModel,
  createDriverRideMessageModel,
} from "../models/driver.chat.model.js";

const ensureDriverCanChat = async (rideId, driverId) => {
  if (!rideId || !driverId) {
    const error = new Error("Ride ID and driver ID are required");
    error.statusCode = 400;
    throw error;
  }

  const ride = await getDriverRideForChatModel(rideId, driverId);

  if (!ride) {
    const error = new Error("Ride not found for this driver");
    error.statusCode = 404;
    throw error;
  }

  if (!["requested", "accepted", "ongoing"].includes(
    String(ride.status).toLowerCase()
  )) {
    const error = new Error("Chat is unavailable for this ride");
    error.statusCode = 409;
    throw error;
  }

  return ride;
};

export const getDriverRideMessagesService = async (rideId, driverId) => {
  await ensureDriverCanChat(rideId, driverId);
  return getDriverRideMessagesModel(rideId);
};

export const sendDriverRideMessageService = async ({
  rideId,
  driverId,
  message,
}) => {
  if (typeof message !== "string" || !message.trim()) {
    const error = new Error("Message cannot be empty");
    error.statusCode = 400;
    throw error;
  }

  await ensureDriverCanChat(rideId, driverId);

  return createDriverRideMessageModel({
    rideId,
    driverId,
    message: message.trim(),
  });
};
