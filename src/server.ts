import app from "./app";
import prisma from "./libs/prismadb";
import dotenv from "dotenv";
import { Server } from "http";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log(" Connected to the database using Prisma.");

    const server: Server = app.listen(PORT, "0.0.0.0", () => {
      console.log(` Server is running on http://0.0.0.0:${PORT}`);
    });

    // ✅ Graceful Shutdown Handling
    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}. Shutting down server...`);
      
      try {
        await prisma.$disconnect();
        console.log(" Prisma connection closed.");
      } catch (error) {
        console.error(" Error closing Prisma connection:", error);
      }

      server.close(() => {
        console.log(" HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    console.error(" Failed to start server:", err);
    process.exit(1);
  }
};

startServer().catch((err) => {
  console.error(" Failed to start server:", err);
  process.exit(1);
});
