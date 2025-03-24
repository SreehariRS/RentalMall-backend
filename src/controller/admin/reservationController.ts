import { Request, Response } from "express";
import { IReservationService } from "../../services/interface/Iadmin";
import { IReservationController } from "../interface/IadminController";

export class ReservationController implements IReservationController {
    private reservationService: IReservationService;

    constructor(reservationService: IReservationService) {
        this.reservationService = reservationService;
    }

    async getAllReservations(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const reservations = await this.reservationService.getAllReservations(page, limit);
            res.status(200).json(reservations);
        } catch (error) {
            let errorMessage = "An unexpected error occurred while fetching reservations";
            if (error instanceof Error) errorMessage = error.message;
            console.error("Error details:", error);
            res.status(500).json({ message: errorMessage });
        }
    }
}
