import { Request, Response, NextFunction } from "express";
import { AdminLoginRequestDto, AdminRefreshRequestDto } from "../dto/admin";

// DTO validation middleware
export class DtoValidationMiddleware {
  // Validate admin login request
  static validateAdminLogin(req: Request, res: Response, next: NextFunction): void {
    try {
      const { email, password }: AdminLoginRequestDto = req.body;
      
      if (!email || typeof email !== 'string') {
        res.status(400).json({ message: "Valid email is required" });
        return;
      }
      
      if (!password || typeof password !== 'string') {
        res.status(400).json({ message: "Valid password is required" });
        return;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Invalid email format" });
        return;
      }
      
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  }

  // Validate admin refresh token request
  static validateAdminRefresh(req: Request, res: Response, next: NextFunction): void {
    try {
      const { refreshToken }: AdminRefreshRequestDto = req.body;
      
      if (!refreshToken || typeof refreshToken !== 'string') {
        res.status(400).json({ message: "Valid refresh token is required" });
        return;
      }
      
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  }

  // Validate pagination query parameters
  static validatePagination(req: Request, res: Response, next: NextFunction): void {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      
      if (page && (isNaN(page) || page < 1)) {
        res.status(400).json({ message: "Page must be a positive number" });
        return;
      }
      
      if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
        res.status(400).json({ message: "Limit must be between 1 and 100" });
        return;
      }
      
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid pagination parameters" });
    }
  }
}
