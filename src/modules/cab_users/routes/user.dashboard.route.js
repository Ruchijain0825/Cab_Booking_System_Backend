import express from "express";

import {
  getAvailableDriversController,
  createRideController,
  getRideHistoryController,
  getActiveRideController,
  getRideDetailsController,
  sendRideMessageController,
  getRideMessagesController,
  sendDriverRideMessageController,
  getDriverRideMessagesController,
} from "../controllers/user.dashboard.controller.js";

import { authMiddleware } from "../../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/drivers/available", getAvailableDriversController);

router.post("/rides", createRideController);

router.get("/rides/history", getRideHistoryController);

router.get("/rides/active", getActiveRideController);

router.get("/rides/:rideId", getRideDetailsController);

router.post("/rides/:rideId/messages", sendRideMessageController);

router.get("/rides/:rideId/messages", getRideMessagesController);
router.post(
  "/:rideId/messages",
  authMiddleware,
  sendDriverRideMessageController
);

router.get(
  "/:rideId/messages",
  authMiddleware,
  getDriverRideMessagesController
);

export default router;