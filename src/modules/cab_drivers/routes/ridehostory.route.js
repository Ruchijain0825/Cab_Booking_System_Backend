
import express from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { getDriverRideHistoryController, getDriverRideByIdController } from "../controllers/ridehistory.controller.js"
const router = express.Router();

router.get("/", authMiddleware, getDriverRideHistoryController);
router.get("/:rideId", authMiddleware, getDriverRideByIdController);

export default router;
