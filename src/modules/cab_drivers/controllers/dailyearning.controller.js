
import { getDailyEarningsService } from "../services/dailyearning.service.js";

export const getDailyEarningsController = async (req, res, next) => {
  try {
    const driverId = req.user?.userId;

    if (!driverId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const earnings = await getDailyEarningsService(driverId);

    return res.status(200).json({
      success: true,
      message: "Daily earnings fetched successfully",
      count: earnings.length,
      data: earnings
    });
  } catch (error) {
    next(error);
  }
};
