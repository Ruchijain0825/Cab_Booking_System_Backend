import express from "express";
import cors from "cors";
import helmet from "helmet";
import driverRoute from "./modules/cab_drivers/routes/driver.route.js";
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Cab Booking API" });
});
app.use("/api/driver",driverRoute);

export default app;