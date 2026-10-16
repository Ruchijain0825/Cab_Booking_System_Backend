
import express from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { updateDriverAvailabilityController, getDriverAvailabilityController } from "../controllers/driveravailability.controller.js"

const router = express.Router();

router.get("/", authMiddleware, getDriverAvailabilityController);
router.patch("/", authMiddleware, updateDriverAvailabilityController);

export default router;
