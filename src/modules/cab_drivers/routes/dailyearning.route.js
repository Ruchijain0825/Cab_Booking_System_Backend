
import express from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { getDailyEarningsController } from "../controllers/dailyearning.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getDailyEarningsController);

export default router;
