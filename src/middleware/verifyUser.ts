import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/customErrors";
import jwt from "jsonwebtoken";

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies.jwt;
        
        if (!token) {
            throw new CustomError("Authorization required", 401);
        }

        // Verify the token
        const data = jwt.verify(token, process.env.JWT_SECRET!);

        if (!data) {
            throw new CustomError("Invalid token", 401);
        }

        // Attach user data to the request object for later use
        (req as any).user = data as { email: string, role: string, id: string };

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle any errors during token verification
        next(error);
    }
};

export default verifyUser;
