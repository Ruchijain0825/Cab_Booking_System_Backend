
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectionDb } from "./config/db.js";

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    console.log("Connecting to database...");
    await connectionDb();
    console.log("Database connected successfully");

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: (
          process.env.FRONTEND_URL || "http://localhost:5173"
        ).split(",").map((url) => url.trim()),
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    app.set("io", io);

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      socket.on("join_ride_chat", ({ rideId }) => {
        if (!rideId || typeof rideId !== "string") return;

        socket.join(`ride:${rideId}`);
        console.log(`Socket ${socket.id} joined ride:${rideId}`);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Socket.IO is ready");
    });
  } catch (error) {
    console.error("Server setup failed:", error);
    process.exit(1);
  }
};

startServer();
