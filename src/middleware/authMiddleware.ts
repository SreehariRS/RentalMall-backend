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

// const JWT_SECRET = process.env.JWT_SECRET || "NEXTAUTH_SECRET";
const JWT_SECRET =  "NEXTAUTH_SECRET";

console.log("JWT_SECRET initialized:", JWT_SECRET); // Log at startup

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Protect middleware - Received token:", token);
  console.log("Request headers:", req.headers);

  if (!token) {
    console.log("No token provided - rejecting request");
    res.status(401).json({ message: "No token provided, authorization denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;
    console.log("Token decoded successfully:", decoded);
    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Invalid token, authorization denied" });
    return;
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  console.log("AdminOnly middleware - req.admin:", req.admin);
  if (!req.admin || req.admin.role !== "admin") {
    console.log("Access denied - not an admin");
    res.status(403).json({ message: "Access denied, admin only" });
    return;
  }
  next();
};