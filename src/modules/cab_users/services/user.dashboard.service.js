
import {
  getAvailableDriversModel,
  createRideModel,
  getRideHistoryModel,
  getActiveRideModel,
  getRideByIdModel,
  createRideMessageModel,
   getRideForChatModel,
  getRideMessagesModel,
} from "../models/user.dashboard.model.js";

const BASE_FARE = 40;
const PER_KM_RATE = 15;
const MIN_FARE = 40;

async function geocodeLocation(address) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", address);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "CabGo/1.0",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error("Location lookup service is unavailable");
  }

  const results = await response.json();

  if (!results.length) {
    throw new Error(`Location not found: ${address}`);
  }

  return {
    latitude: Number(results[0].lat),
    longitude: Number(results[0].lon),
  };
}

async function calculateRoadFare(pickup, drop) {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${pickup.longitude},${pickup.latitude};` +
    `${drop.longitude},${drop.latitude}?overview=false`;

  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error("Unable to calculate driving route");
  }

  const result = await response.json();
  const route = result.routes?.[0];

  if (result.code !== "Ok" || !route) {
    throw new Error("No driving route found between these locations");
  }

  const distanceKm = route.distance / 1000;
  const fareAmount = Math.max(
    MIN_FARE,
    Math.ceil(BASE_FARE + distanceKm * PER_KM_RATE)
  );

  return {
    distanceKm: Number(distanceKm.toFixed(2)),
    fareAmount,
  };
}

export const getAvailableDriversService = async () => {
  return getAvailableDriversModel();
};

export const createRideService = async (userId, data) => {
  const {
    driverId,
    pickupLocation,
    pickupLatitude,
    pickupLongitude,
    dropLocation,
    dropLatitude,
    dropLongitude,
  } = data;

  if (!driverId) {
    throw new Error("Please select a driver");
  }

  if (
    typeof pickupLocation !== "string" ||
    !pickupLocation.trim() ||
    typeof dropLocation !== "string" ||
    !dropLocation.trim()
  ) {
    throw new Error("Pickup and drop locations are required");
  }

  const validCoordinate = (value, min, max) =>
    value == null ||
    (typeof value === "number" &&
      Number.isFinite(value) &&
      value >= min &&
      value <= max);

  if (
    !validCoordinate(pickupLatitude, -90, 90) ||
    !validCoordinate(dropLatitude, -90, 90) ||
    !validCoordinate(pickupLongitude, -180, 180) ||
    !validCoordinate(dropLongitude, -180, 180)
  ) {
    throw new Error("Invalid pickup or drop coordinates");
  }

  const pickup =
    pickupLatitude != null && pickupLongitude != null
      ? {
          latitude: pickupLatitude,
          longitude: pickupLongitude,
        }
      : await geocodeLocation(pickupLocation.trim());

  const drop =
    dropLatitude != null && dropLongitude != null
      ? {
          latitude: dropLatitude,
          longitude: dropLongitude,
        }
      : await geocodeLocation(dropLocation.trim());

  const { fareAmount } = await calculateRoadFare(pickup, drop);

  return createRideModel({
    userId,
    driverId,
    pickupLocation: pickupLocation.trim(),
    pickupLatitude: pickup.latitude,
    pickupLongitude: pickup.longitude,
    dropLocation: dropLocation.trim(),
    dropLatitude: drop.latitude,
    dropLongitude: drop.longitude,
    fareAmount,
  });
};

export const getRideHistoryService = async (userId) => {
  return getRideHistoryModel(userId);
};

export const getActiveRideService = async (userId) => {
  return getActiveRideModel(userId);
};

export const getRideDetailsService = async (rideId, userId) => {
  const ride = await getRideByIdModel(rideId, userId);

  if (!ride) {
    const error = new Error("Ride not found");
    error.statusCode = 404;
    throw error;
  }

  return ride;
};

const validateChatRide = async (rideId, actorId, actorType) => {
  const ride = await getRideForChatModel(rideId);

  if (!ride) {
    const error = new Error("Ride not found");
    error.statusCode = 404;
    throw error;
  }

  const isCustomer =
    actorType === "USER" &&
    String(ride.rider_id) === String(actorId);

  const isDriver =
    actorType === "DRIVER" &&
    String(ride.driver_id) === String(actorId);

  if (!isCustomer && !isDriver) {
    const error = new Error("You are not authorized for this ride");
    error.statusCode = 403;
    throw error;
  }

  if (
    !["accepted", "ongoing"].includes(
      String(ride.status).toLowerCase()
    )
  ) {
    const error = new Error("Chat is available after the driver accepts the ride");
    error.statusCode = 409;
    throw error;
  }

  return ride;
};

export const sendRideMessageService = async ({
  rideId,
  userId,
  message,
  senderType = "USER",
}) => {
  if (typeof message !== "string" || !message.trim()) {
    throw new Error("Message cannot be empty");
  }

  if (message.trim().length > 1000) {
    throw new Error("Message cannot exceed 1000 characters");
  }

  if (!["USER", "DRIVER"].includes(senderType)) {
    throw new Error("Invalid sender type");
  }

  await validateChatRide(rideId, userId, senderType);

  return createRideMessageModel({
    rideId,
    senderType,
    senderId: userId,
    message: message.trim(),
  });
};

export const getRideMessagesService = async (
  rideId,
  userId,
  actorType = "USER"
) => {
  await validateChatRide(rideId, userId, actorType);
  return getRideMessagesModel(rideId);
};