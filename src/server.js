import dotenv from "dotenv";

dotenv.config();
import app from "./app.js";

import { connectionDb } from "./config/db.js";
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    console.log("Connecting to database...");

    await connectionDb();

    console.log("Database connected successfully");

const server = app.listen(PORT, () => {
  console.log("Server address:", server.address());
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (error) => {
  console.error("Server listen error:", error);
});
  } catch (error) {
    console.error("Server setup failed:", error);
    process.exit(1);
  }
};

startServer();