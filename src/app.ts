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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("DEBUG: CLIENT_URL in CORS:", process.env.CLIENT_URL);

app.use(
  cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : ["http://localhost:3000"],
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
