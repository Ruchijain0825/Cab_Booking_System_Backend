
import { getDriverDashboard } from "../services/dashboard.service.js";

export const getDashboardController = async (req, res, next) => {
  try {
    const driverId = req.user?.userId;

    if (!driverId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const data = await getDriverDashboard(driverId);

    return res.status(200).json({
      success: true,
      message: "Dashboard fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
