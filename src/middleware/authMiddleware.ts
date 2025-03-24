import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AdminPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Received token:", token); // Debug log

  if (!token) {
    console.log("No token provided");
    res.status(401).json({ message: "No token provided, authorization denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;
    console.log("Decoded token:", decoded); // Debug log
    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error); // Debug log
    res.status(401).json({ message: "Invalid token, authorization denied" });
    return;
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.admin || req.admin.role !== "admin") {
    res.status(403).json({ message: "Access denied, admin only" });
    return;
  }
  next();
};