
import express from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { getPendingRideRequestsController, acceptRideRequestController,declineRideRequestController,startRideController,completeRideController } from "../controllers/rides.controller.js";
import {getDriverRideMessagesController,sendDriverRideMessageController} from "../controllers/driver.chat.controller.js"
import { getDriverActiveRideController} from "../controllers/driver.active.ride.controller.js";
const router = express.Router();

router.get("/requests", authMiddleware, getPendingRideRequestsController);
router.patch("/:rideId/accept", authMiddleware, acceptRideRequestController);
router.patch("/:rideId/decline", authMiddleware, declineRideRequestController);
router.get(
  "/:rideId/messages",
  authMiddleware,
  getDriverRideMessagesController
);

router.post(
  "/:rideId/messages",
  authMiddleware,
  sendDriverRideMessageController
);
router.get("/active", authMiddleware, getDriverActiveRideController);
router.patch(
  "/:rideId/start",
  authMiddleware,
  startRideController
);

router.patch(
  "/:rideId/complete",
  authMiddleware,
  completeRideController
);
export default router;
