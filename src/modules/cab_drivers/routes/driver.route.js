import express from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { loginController, registerController, getAvailabilityController,updateAvailabilityController } from "../controllers/driver.controlle.js";
const router = express.Router();
router.post("/register",registerController);
router.post("/login",loginController);
router.get(
  "/availability",
  authMiddleware,
  getAvailabilityController
);

router.patch(
  "/availability",
  authMiddleware,
  updateAvailabilityController
);

export default router;