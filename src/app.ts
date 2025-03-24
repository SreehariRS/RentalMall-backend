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

// Define allowed origins (Ensure they don't have trailing slashes)
const allowedOrigins = [
  "http://localhost:3000",
  "https://www.rentalmall.site"
];

// Log the CORS origin being used
const corsOrigin = process.env.CLIENT_URL?.replace(/\/$/, "") || "http://localhost:3000";
console.log("CORS Origin set to:", corsOrigin);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow non-browser requests

      // Normalize origin (remove trailing slash)
      origin = origin.replace(/\/$/, "");

      console.log("Request Origin:", origin);
      console.log("Allowed Origins:", allowedOrigins);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

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

// ✅ 404 Fallback Route
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Route Not Found" });
});

// ✅ Global Error Handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Global Error: ${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
