import { Request, Response } from "express";
import AdminService from "../services/adminService";

export class AdminController {
    private adminService: AdminService;

    constructor(adminService: AdminService) {
        this.adminService = adminService;
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

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
        } catch (error) {
            let errorMessage = "An unexpected error occurred";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error details:", error);
            res.status(500).json({ message: errorMessage });
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 8;

            const paginatedData = await this.adminService.getAllUsers(page, limit);
            res.status(200).json(paginatedData);
        } catch (error) {
            let errorMessage = "An unexpected error occurred while fetching users";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error details:", error);
            res.status(500).json({ message: errorMessage });
        }
    }

    async blockUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const user = await this.adminService.blockUser(userId);

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            res.status(200).json({ message: "User blocked successfully", user });
        } catch (error) {
            let errorMessage = "An unexpected error occurred while blocking the user";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error details:", error);
            res.status(500).json({ message: errorMessage });
        }
    }

    async unblockUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const user = await this.adminService.unblockUser(userId);

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            res.status(200).json({ message: "User unblocked successfully", user });
        } catch (error) {
            let errorMessage = "An unexpected error occurred while unblocking the user";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error details:", error);
            res.status(500).json({ message: errorMessage });
        }
    }

async getAllHosts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const paginatedData = await this.adminService.getAllHosts(page, limit);
      res.status(200).json(paginatedData);
    } catch (error) {
      let errorMessage = "An unexpected error occurred while fetching hosts";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error details:", error);
      res.status(500).json({ message: errorMessage });
    }
  }
    // Get all reservations
    async getAllReservations(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const reservations = await this.adminService.getAllReservations(page, limit);
            res.status(200).json(reservations);
        } catch (error) {
            let errorMessage = "An unexpected error occurred while fetching reservations";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error details:", error);
            res.status(500).json({ message: errorMessage });
        }
    }

    //dashboard
    async getDashboardStats(req: Request, res: Response): Promise<void> {
        try {
            const stats = await this.adminService.getDashboardStats();
            res.status(200).json(stats); // The response now includes totalHosts
        } catch (error) {
            console.error("Error in getDashboardStats:", error);
            res.status(500).json({ message: "Failed to fetch dashboard stats" });
        }
    }
}
