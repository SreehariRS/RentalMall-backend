import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/customErrors";
import jwt from "jsonwebtoken";

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies.jwt;
        console.log(token)
        if (!token) {
            throw new CustomError("Authorization required", 401);
        }

        const data = jwt.verify(token, process.env.JWT_SECRET!);

        if (!data) {
            throw new CustomError("Invalid token", 401);
        }

        (req as any).user = data as { email: string, role: string, id: string };

        next();
    } catch (error) {
        next(error);
    }
};

export default verifyUser;
