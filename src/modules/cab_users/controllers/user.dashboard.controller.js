import {
  getAvailableDriversService,
  createRideService,
  getRideHistoryService,
  getActiveRideService,
  getRideDetailsService,
  sendRideMessageService,
  getRideMessagesService,
  
} from "../services/user.dashboard.service.js";

export const getAvailableDriversController = async (req, res, next) => {
  try {
    const drivers = await getAvailableDriversService();

    return res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers,
    });
  } catch (error) {
    next(error);
  }
};

export const createRideController = async (req, res, next) => {
  try {
    const ride = await createRideService(req.user.userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Ride requested successfully",
      data: ride,
    });
  } catch (error) {
    next(error);
  }
};

export const getRideHistoryController = async (req, res, next) => {
  try {
    const rides = await getRideHistoryService(req.user.userId);

    return res.status(200).json({
      success: true,
      count: rides.length,
      data: rides,
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveRideController = async (req, res, next) => {
  try {
    const ride = await getActiveRideService(req.user.userId);

    return res.status(200).json({
      success: true,
      data: ride,
    });
  } catch (error) {
    next(error);
  }
};

export const getRideDetailsController = async (req, res, next) => {
  try {
    const ride = await getRideDetailsService(
      req.params.rideId,
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      data: ride,
    });
  } catch (error) {
    next(error);
  }
};

export const sendRideMessageController = async (req, res, next) => {
  try {
    const message = await sendRideMessageService({
      rideId: req.params.rideId,
      userId: req.user.userId,
      message: req.body.message,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("SEND RIDE MESSAGE ERROR:", error);
    next(error);
  }
};
export const getRideMessagesController = async (req, res, next) => {
  try {
    const messages = await getRideMessagesService(
      req.params.rideId,
      req.user.userId
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
    const message = await sendRideMessageService({
      rideId: req.params.rideId,
      userId: req.user.userId,
      message: req.body.message,
      senderType: "DRIVER",
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

// Driver fetches messages
export const getDriverRideMessagesController = async (req, res, next) => {
  try {
    const messages = await getRideMessagesService(
      req.params.rideId,
      req.user.userId,
      "DRIVER"
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