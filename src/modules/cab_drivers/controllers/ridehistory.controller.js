
import { getDriverRideHistoryService, getDriverRideByIdService } from "../services/ridehostory.service.js";

export const getDriverRideHistoryController = async (req, res, next) => {
  try {
    const driverId = req.user?.userId;
    if (!driverId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { limit = 20, offset = 0 } = req.query;
    const rides = await getDriverRideHistoryService(driverId, limit, offset);

    return res.status(200).json({ success: true, count: rides.length, data: rides });
  } catch (error) {
    next(error);
  }
};

export const getDriverRideByIdController = async (req, res, next) => {
  try {
    const driverId = req.user?.userId;
    const { rideId } = req.params;
    if (!driverId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const ride = await getDriverRideByIdService(rideId, driverId);
    return res.status(200).json({ success: true, data: ride });
  } catch (error) {
    next(error);
  }
};
