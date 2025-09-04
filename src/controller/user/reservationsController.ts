import { Request, Response } from "express";
import { IReservationsService } from "../../services/interface/Iuser";
import { IReservationsController } from "../interface/IuserController";
import { HttpStatusCodes } from "../../config/HttpStatusCodes";
import { Messages } from "../../config/message";
import { pusherServer } from "../../libs/pusher";

export class ReservationsController implements IReservationsController {
    private _reservationsService: IReservationsService;

    constructor(reservationsService: IReservationsService) {
        this._reservationsService = reservationsService;
    }

    async createReservation(req: Request, res: Response): Promise<Response> {
        try {
            const reservation = await this._reservationsService.createReservation(req.body);
            return res.status(HttpStatusCodes.CREATED).json(reservation);
        } catch (error: any) {
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    async cancelReservation(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) {
                return res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
            }
            const { reservationId } = req.params;
            if (!reservationId || typeof reservationId !== "string") {
                return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: Messages.INVALID_ID });
            }
            const result = await this._reservationsService.cancelReservation(
                { reservationId, userId: currentUser.id },
                currentUser.id
            );
            await pusherServer.trigger(`user-${currentUser.email}-notifications`, "notification:new", {
                message: Messages.RESERVATION_CANCELED_SUCCESS,
            });
            return res.status(HttpStatusCodes.OK).json(result);
        } catch (error) {
            console.error("CANCEL_RESERVATION_ERROR", error);
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR });
        }
    }
}