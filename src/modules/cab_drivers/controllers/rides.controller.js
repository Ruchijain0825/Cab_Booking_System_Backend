
import { getPendingRideRequestsService, acceptRideRequestService, declineRideRequestService } from "../services/ride.service.js";

export const getPendingRideRequestsController = async (req, res, next) => {
  try {
    const driverId = req.user?.userId;
    if (!driverId) return res.status(401).json({ success: false, message: "Unauthorized: Driver not found" });

    const rides = await getPendingRideRequestsService(driverId);
    return res.status(200).json({ success: true, message: "Pending ride requests fetched successfully", count: rides.length, data: rides });
  } catch (error) {
    next(error);
  }
};

export const acceptRideRequestController = async (req, res, next) => {
  try {
    const driverId = req.user?.userId;
    const { rideId } = req.params;
    if (!driverId) return res.status(401).json({ success: false, message: "Unauthorized: Driver not found" });

    const ride = await acceptRideRequestService(rideId, driverId);
    return res.status(200).json({ success: true, message: "Ride accepted successfully", data: ride });
  } catch (error) {
    next(error);
  }
};

export const declineRideRequestController = async (req, res, next) => {
  try {
    const driverId = req.user?.userId;
    const { rideId } = req.params;
    if (!driverId) return res.status(401).json({ success: false, message: "Unauthorized: Driver not found" });

    const result = await declineRideRequestService(rideId, driverId);
    return res.status(200).json({ success: true, message: "Ride request declined successfully", data: result });
  } catch (error) {
    next(error);
  }
};
