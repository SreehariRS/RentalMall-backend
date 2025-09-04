import { Request, Response } from "express";
import { IHostService } from "../../services/interface/Iadmin";
import { IHostController } from "../interface/IadminController";
import { HostQueryDto } from "../../dto/admin";
import { HttpStatusCodes } from "../../config/HttpStatusCodes";
import { Messages } from "../../config/message";

export class HostController implements IHostController {
  private _hostService: IHostService;

  constructor(hostService: IHostService) {
    this._hostService = hostService;
  }

  async getAllHosts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;
      
      const queryParams: HostQueryDto = { page, limit };
      const paginatedData = await this._hostService.getAllHosts(
        queryParams.page, 
        queryParams.limit
      );
      res.status(HttpStatusCodes.OK).json(paginatedData);
    } catch (error) {
      let errorMessage: string = Messages.UNEXPECTED_ERROR_HOSTS;
      if (error instanceof Error) errorMessage = error.message;
      console.error("Error details:", error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    }
  }
}