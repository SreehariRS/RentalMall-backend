import { Request, Response } from "express";
import { IReservationService } from "../../services/interface/Iadmin";
import { IReservationController } from "../interface/IadminController";
import { ReservationQueryDto } from "../../dto/admin";
import { HttpStatusCodes } from "../../config/HttpStatusCodes";
import { Messages } from "../../config/message";

export class ReservationController implements IReservationController {
  private _reservationService: IReservationService;

  constructor(reservationService: IReservationService) {
    this._reservationService = reservationService;
  }

  async getAllReservations(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;
      
      const queryParams: ReservationQueryDto = { page, limit };
      const paginatedData = await this._reservationService.getAllReservations(
        queryParams.page, 
        queryParams.limit
      );
      res.status(HttpStatusCodes.OK).json(paginatedData);
    } catch (error) {
      let errorMessage: string = Messages.UNEXPECTED_ERROR_RESERVATIONS;
      if (error instanceof Error) errorMessage = error.message;
      console.error("Error details:", error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    }
  }
}