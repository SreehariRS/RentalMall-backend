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


const allowedOrigins = [
  "http://localhost:3000",
  "https://www.rentalmall.site",
  "https://rentalmall.site",
];


const normalizeUrl = (url: string | undefined): string => {
  if (!url) return "";
  return url.replace(/\/+$/, "");
  
};


const corsOrigin = normalizeUrl(process.env.CLIENT_URL) || "http://localhost:3000";


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
     
      


      if (!origin) return callback(null, true);

      
      const normalizedOrigin = normalizeUrl(origin);
      const normalizedAllowedOrigins = allowedOrigins.map(normalizeUrl);
      const normalizedCorsOrigin = normalizeUrl(corsOrigin);

      console.log("Normalized Request Origin:", normalizedOrigin);
      console.log("Normalized Allowed Origins:", normalizedAllowedOrigins);
      console.log("Normalized CORS Origin from env:", normalizedCorsOrigin);

      // Check if the normalized origin is allowed
      if (
        normalizedOrigin === normalizedCorsOrigin ||
        normalizedAllowedOrigins.includes(normalizedOrigin)
      ) {
        return callback(null, origin);
      }

     
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

// Health Check (before other routes)
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

//  Root Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "RentalMall Backend is Running 🚀" });
});

// Routes
app.use("/api/admin", adminRouter);
app.use("/api", userRouter);

// 04 Fallback Route (handles unknown paths)
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Route Not Found" });
});

// Global Error Handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Global Error: ${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
  
});

export default app;