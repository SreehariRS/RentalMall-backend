import { Request, Response } from "express";
import UserService from "../../services/admin/userService";

export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 8;
            const paginatedData = await this.userService.getAllUsers(page, limit);
            res.status(200).json(paginatedData);
        } catch (error) {
            let errorMessage = "An unexpected error occurred while fetching users";
            if (error instanceof Error) errorMessage = error.message;
            console.error("Error details:", error);
            res.status(500).json({ message: errorMessage });
        }
    }

    async blockUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const user = await this.userService.blockUser(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json({ message: "User blocked successfully", user });
        } catch (error) {
            let errorMessage = "An unexpected error occurred while blocking the user";
            if (error instanceof Error) errorMessage = error.message;
            console.error("Error details:", error);
            res.status(500).json({ message: errorMessage });
        }
    }

    async unblockUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const user = await this.userService.unblockUser(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json({ message: "User unblocked successfully", user });
        } catch (error) {
            let errorMessage = "An unexpected error occurred while unblocking the user";
            if (error instanceof Error) errorMessage = error.message;
            console.error("Error details:", error);
            res.status(500).json({ message: errorMessage });
        }
    }
}