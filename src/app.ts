import adminRouter from './routes/adminRoutes';
import userRouter from "./routes/usereRouts"
import logger from './middleware/logger';

import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from "http";

dotenv.config();
const app: Application = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// Routes
app.use('/api/admin', adminRouter); 
app.use('/api',userRouter)
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

export default app;
