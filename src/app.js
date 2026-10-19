
import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoute from "./modules/cab_users/routes/user.auth.route.js"
import driverRoute from "./modules/cab_drivers/routes/driver.route.js";
import dashboardRoute from "./modules/cab_drivers/routes/dashboard.route.js";
import rideRoute from "./modules/cab_drivers/routes/ride.route.js";
import rideHistoryRoute from "./modules/cab_drivers/routes/ridehostory.route.js";
import earningsRoute from "./modules/cab_drivers/routes/earning.route.js";
import dailyEarningsRoute from "./modules/cab_drivers/routes/dailyearning.route.js";
import userDashboardRoute from "./modules/cab_users/routes/user.dashboard.route.js";

import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(helmet());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Cab Booking API is running",
  });
});

// Driver: register, login
// Availability routes must also be registered in driver.route.js
app.use("/api/driver", driverRoute);
app.use("/api/user",userRoute);
// Dashboard APIs
app.use("/api/dashboard", dashboardRoute);

// Earnings routes
// These routers should define their own paths, e.g. "/" for earnings.
app.use("/api/dashboard/earnings", earningsRoute);
app.use("/api/dashboard/daily-earnings", dailyEarningsRoute);

// Rides
app.use("/api/rides", rideRoute);

// Ride history: mount only if rideHistoryRoute defines "/" and "/:rideId"
app.use("/api/rides/history", rideHistoryRoute);
app.use("/api/user", userDashboardRoute);

// Error handling middleware should be last
app.use(errorMiddleware);

export default app;
