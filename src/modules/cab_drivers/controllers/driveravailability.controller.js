
import { updateDriverAvailabilityService, getDriverAvailabilityService } from "../services/driveravailability.service.js"

export const updateDriverAvailabilityController = async (req, res, next) => {
  try {
    const driverId = req.user?.userId;
    const { isOnline } = req.body;

    if (!driverId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const driver = await updateDriverAvailabilityService(driverId, isOnline);
    return res.status(200).json({ success: true, message: `Driver is now ${driver.is_online ? "online" : "offline"}`, data: driver });
  } catch (error) {
    next(error);
  }
};

export const getDriverAvailabilityController = async (req, res, next) => {
  try {
    const driverId = req.user?.userId;
    if (!driverId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const driver = await getDriverAvailabilityService(driverId);
    return res.status(200).json({ success: true, data: driver });
  } catch (error) {
    next(error);
  }
};
