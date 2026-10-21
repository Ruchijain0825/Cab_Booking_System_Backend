
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
import paymentRoutes from "./modules/payment/routes/payment.route.js";
import stripeWebhookRoutes from "./modules/payment/routes/stripe-webhook.route.js";

import { errorMiddleware } from "./middlewares/error.middleware.js";


const app = express();

// Middleware
import cors from "cors";

const allowedOrigins = [
  "https://cab-booking-system-frontend-opal.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());
app.use("/api/payments/webhook", stripeWebhookRoutes);
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
app.use("/api/payments", paymentRoutes);

// Error handling middleware should be last
app.use(errorMiddleware);

export default app;
