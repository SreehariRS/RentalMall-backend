import { Request, Response } from "express";
import { IDashboardService } from "../../services/interface/Iadmin";
import { IDashboardController } from "../interface/IadminController";

export class DashboardController implements IDashboardController {
    private dashboardService: IDashboardService;

    constructor(dashboardService: IDashboardService) {
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
