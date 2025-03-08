import { Request, Response } from "express";
import AuthService from "../../services/admin/authService";

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ message: "Email and password are required" });
                return;
            }

            const isAdmin = await this.authService.findByEmail(email);
            if (!isAdmin) {
                res.status(401).json({ message: "Incorrect email" });
                return;
            }

            if (password !== isAdmin.password) {
                res.status(401).json({ message: "Incorrect password" });
                return;
            }

            res.status(200).json({ message: "Login successful" });
        } catch (error) {
            let errorMessage = "An unexpected error occurred";
            if (error instanceof Error) errorMessage = error.message;
            console.error("Error details:", error);
            res.status(500).json({ message: errorMessage });
        }
    }
}