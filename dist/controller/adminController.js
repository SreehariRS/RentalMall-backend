"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            // Validate input
            if (!email || !password) {
                res.status(400).json({ message: "Email and password are required" });
                return;
            }
            const isAdmin = await this.adminService.findByEmail(email);
            if (!isAdmin) {
                res.status(401).json({ message: "Incorrect email" });
                return;
            }
            if (password !== isAdmin.password) {
                res.status(401).json({ message: "Incorrect password" });
                return;
            }
            res.status(200).json({ message: "Login successful" });
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error details:", error);
            res.status(500).json({ message: errorMessage });
        }
    }
    async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const paginatedData = await this.adminService.getAllUsers(page, limit);
            res.status(200).json(paginatedData);
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred while fetching users";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error details:", error);
            res.status(500).json({ message: errorMessage });
        }
    }
    // Block a user
    async blockUser(req, res) {
        try {
            const { userId } = req.params;
            const user = await this.adminService.blockUser(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json({ message: "User blocked successfully", user });
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred while blocking the user";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error details:", error);
            res.status(500).json({ message: errorMessage });
        }
    }
    // Unblock a user
    async unblockUser(req, res) {
        try {
            const { userId } = req.params;
            const user = await this.adminService.unblockUser(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json({ message: "User unblocked successfully", user });
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred while unblocking the user";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error details:", error);
            res.status(500).json({ message: errorMessage });
        }
    }
}
exports.AdminController = AdminController;
