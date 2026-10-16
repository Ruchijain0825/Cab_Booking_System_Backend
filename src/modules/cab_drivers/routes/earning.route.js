
import express from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { getDriverEarningsController } from "../controllers/earning.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getDriverEarningsController);

export default router;
