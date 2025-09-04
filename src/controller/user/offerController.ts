import { Request, Response } from "express";
import { IOfferService } from "../../services/interface/Iuser";
import { IOfferController } from "../interface/IuserController";
import { HttpStatusCodes } from "../../config/HttpStatusCodes";
import { Messages } from "../../config/message";

export class OfferController implements IOfferController {
    private _offerService: IOfferService;

    constructor(offerService: IOfferService) {
        this._offerService = offerService;
    }

    async updateOfferPrice(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) return res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
            const { listingId } = req.params;
            if (!listingId || typeof listingId !== "string")
                return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: Messages.INVALID_ID });
            const { offerPrice } = req.body;
            const result = await this._offerService.updateOfferPrice({ listingId, userId: currentUser.id, offerPrice });
            return res.status(HttpStatusCodes.OK).json(result);
        } catch (error) {
            console.error("UPDATE_OFFER_PRICE_ERROR", error);
            const errorMessage = error instanceof Error ? error.message : Messages.SOMETHING_WENT_WRONG;
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
        }
    }
}