import { Request, Response } from "express";
import { IOfferService } from "../../services/interface/Iuser";
import { IOfferController } from "../interface/IuserController";

export class OfferController implements IOfferController {
    private offerService: IOfferService;

    constructor(offerService: IOfferService) {
        this.offerService = offerService;
    }

    async updateOfferPrice(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) return res.status(401).json({ message: "Unauthorized" });
            const { listingId } = req.params;
            if (!listingId || typeof listingId !== "string") return res.status(400).json({ message: "Invalid ID" });
            const { offerPrice } = req.body;
            const result = await this.offerService.updateOfferPrice({ listingId, userId: currentUser.id, offerPrice });
            return res.status(200).json(result);
        } catch (error) {
            console.error("UPDATE_OFFER_PRICE_ERROR", error);
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            return res.status(500).json({ message: errorMessage });
        }
    }
}