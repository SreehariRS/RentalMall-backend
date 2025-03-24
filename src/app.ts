import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import adminRouter from "./routes/adminRoutes";
import userRouter from "./routes/userRoutes";
import logger from "./middleware/logger";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://www.rentalmall.site",
];

// Log the CORS origin being used
const corsOrigin = process.env.CLIENT_URL || "http://localhost:3000";
console.log("CORS Origin set to:", corsOrigin);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      // Log for debugging
      console.log("Request Origin:", origin);
      console.log("CLIENT_URL from env:", process.env.CLIENT_URL);

      // Allow requests with no origin (e.g., Postman or curl)
      if (!origin) return callback(null, true);

      // Use CLIENT_URL if available, otherwise fallback to production URL
      const allowedOrigin ="https://www.rentalmall.site"; // Default to production URL
      console.log("Resolved Allowed Origin:", allowedOrigin);

      // Check if the origin is allowed
      if (origin === allowedOrigin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Log the rejection for debugging
      console.log("CORS rejected for origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// ✅ Health Check (before other routes)
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// ✅ Root Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "RentalMall Backend is Running 🚀" });
});

// Routes
app.use("/api/admin", adminRouter);
app.use("/api", userRouter);

// ✅ 404 Fallback Route (handles unknown paths)
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Route Not Found" });
});

// ✅ Global Error Handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Global Error: ${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;