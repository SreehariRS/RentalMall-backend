import { Request, Response } from "express";
import DashboardService from "../../services/admin/dashboardService";

export class DashboardController {
    private dashboardService: DashboardService;

    constructor(dashboardService: DashboardService) {
        this.dashboardService = dashboardService;
    }

    async getDashboardStats(req: Request, res: Response): Promise<void> {
        try {
            const stats = await this.dashboardService.getDashboardStats();
            res.status(200).json(stats);
        } catch (error) {
            console.error("Error in getDashboardStats:", error);
            res.status(500).json({ message: "Failed to fetch dashboard stats" });
        }
    }
}