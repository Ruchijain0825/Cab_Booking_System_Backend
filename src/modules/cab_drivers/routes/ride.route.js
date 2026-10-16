
import express from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { getPendingRideRequestsController, acceptRideRequestController,declineRideRequestController  } from "../controllers/rides.controller.js";

const router = express.Router();

router.get("/requests", authMiddleware, getPendingRideRequestsController);
router.patch("/:rideId/accept", authMiddleware, acceptRideRequestController);
router.patch("/:rideId/decline", authMiddleware, declineRideRequestController);

export default router;
