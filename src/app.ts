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
  "https://www.rentalmall.site", // Without trailing slash
  "https://www.rentalmall.site/", // With trailing slash
  "http://localhost:3000", // For local development
];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("DEBUG: CLIENT_URL in CORS:", process.env.CLIENT_URL);

// Configure CORS with dynamic origin checking and detailed logging
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Incoming origin:", origin); // Log the incoming origin
      if (!origin) {
        console.log("No origin provided (e.g., Postman/curl), allowing request.");
        return callback(null, true);
      }

      // Normalize origin by removing trailing slash
      const normalizedOrigin = origin.replace(/\/$/, "");
      const normalizedAllowedOrigins = allowedOrigins.map((o) => o.replace(/\/$/, ""));
      console.log("Normalized origin:", normalizedOrigin);
      console.log("Allowed origins:", normalizedAllowedOrigins);

      if (normalizedAllowedOrigins.includes(normalizedOrigin)) {
        console.log("Origin is allowed by CORS.");
        return callback(null, true);
      }

      console.log("Origin not allowed by CORS.");
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Explicitly handle OPTIONS preflight requests for /api/admin
app.options("/api/admin", (req: Request, res: Response) => {
  console.log("Handling OPTIONS preflight for /api/admin");
  res.setHeader("Access-Control-Allow-Origin", "https://www.rentalmall.site");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204); // No content for preflight
});

// General preflight handling for other routes
app.options("*", cors());

app.use(cookieParser());
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Health Check (before other routes)
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "RentalMall Backend is Running 🚀" });
});

// Routes
app.use("/api/admin", adminRouter);
app.use("/api", userRouter);

// 404 Fallback Route (handles unknown paths)
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Route Not Found" });
});

// Global Error Handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Global Error: ${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;