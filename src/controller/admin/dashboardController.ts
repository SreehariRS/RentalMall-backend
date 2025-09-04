import { Request, Response } from "express";
import { IDashboardService } from "../../services/interface/Iadmin";
import { IDashboardController } from "../interface/IadminController";
import { HttpStatusCodes } from "../../config/HttpStatusCodes";
import { Messages } from "../../config/message";

export class DashboardController implements IDashboardController {
  private _dashboardService: IDashboardService;

  constructor(dashboardService: IDashboardService) {
    this._dashboardService = dashboardService;
  }

  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this._dashboardService.getDashboardStats();
      res.status(HttpStatusCodes.OK).json(stats);
    } catch (error) {
      let errorMessage: string = Messages.UNEXPECTED_ERROR_DASHBOARD;
      if (error instanceof Error) errorMessage = error.message;
      console.error("Error details:", error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    }
  }
}