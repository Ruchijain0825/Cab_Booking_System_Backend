
import { getDriverActiveRideService } from "../services/driver.active.service.js";

export const getDriverActiveRideController = async (req, res, next) => {
  try {
    const driverId = req.user?.userId;

    if (!driverId) {
      return res.status(401).json({
        success: false,
        message: "Driver authentication required",
      });
    }

    const ride = await getDriverActiveRideService(driverId);

    return res.status(200).json({
      success: true,
      data: ride,
    });
  } catch (error) {
    next(error);
  }
};
