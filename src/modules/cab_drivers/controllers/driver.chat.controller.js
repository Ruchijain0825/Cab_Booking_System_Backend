
import {
  getDriverRideMessagesService,
  sendDriverRideMessageService,
} from "../services/driver.chat.service.js";

export const getDriverRideMessagesController = async (req, res, next) => {
  try {
    const messages = await getDriverRideMessagesService(
      req.params.rideId,
      req.user?.userId
    );

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const sendDriverRideMessageController = async (req, res, next) => {
  try {
    const message = await sendDriverRideMessageService({
      rideId: req.params.rideId,
      driverId: req.user?.userId,
      message: req.body.message,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
