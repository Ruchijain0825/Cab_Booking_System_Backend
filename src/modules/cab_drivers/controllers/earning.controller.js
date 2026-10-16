
import { getDriverEarningsService } from "../services/earning.service.js";

export const getDriverEarningsController = async (req, res, next) => {
  try {
    const driverId = req.user?.userId;

    if (!driverId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const earnings = await getDriverEarningsService(driverId);

    return res.status(200).json({
      success: true,
      message: "Driver earnings fetched successfully",
      data: earnings
    });
  } catch (error) {
    next(error);
  }
};
