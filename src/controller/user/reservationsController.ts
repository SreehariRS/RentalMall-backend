import { Request, Response } from "express";
import { IReservationsService } from "../../services/interface/Iuser";
import { IReservationsController } from "../interface/IuserController";
import { pusherServer } from "../../libs/pusher";

export class ReservationsController implements IReservationsController {
    private reservationsService: IReservationsService;

    constructor(reservationsService: IReservationsService) {
        this.reservationsService = reservationsService;
    }

    async createReservation(req: Request, res: Response): Promise<Response> {
        try {
            const reservation = await this.reservationsService.createReservation(req.body);
            return res.status(201).json(reservation);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async cancelReservation(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const { reservationId } = req.params;
            if (!reservationId || typeof reservationId !== "string") {
                return res.status(400).json({ message: "Invalid ID" });
            }
            const result = await this.reservationsService.cancelReservation({ reservationId, userId: currentUser.id }, currentUser.id);
            await pusherServer.trigger(`user-${currentUser.email}-notifications`, "notification:new", {
                message: "Your reservation has been canceled.",
            });
            return res.status(200).json(result);
        } catch (error) {
            console.error("CANCEL_RESERVATION_ERROR", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}