import { Request, Response } from "express";
import { IFavoritesService } from "../../services/interface/Iuser";
import { IFavoritesController } from "../interface/IuserController";
import { HttpStatusCodes } from "../../config/HttpStatusCodes";
import { Messages } from "../../config/message";

export class FavoritesController implements IFavoritesController {
    private _favoritesService: IFavoritesService;

    constructor(favoritesService: IFavoritesService) {
        this._favoritesService = favoritesService;
    }

    async addFavorite(req: Request, res: Response): Promise<Response> {
        const { userId, listingId } = req.body;
        if (!userId || !listingId) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: Messages.USER_ID_LISTING_ID_REQUIRED });
        }
        try {
            const user = await this._favoritesService.addToFavorites(userId, listingId);
            return res.status(HttpStatusCodes.OK).json(user);
        } catch (error: any) {
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    async removeFavorite(req: Request, res: Response): Promise<Response> {
        const { userId, listingId } = req.body;
        if (!userId || !listingId) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: Messages.USER_ID_LISTING_ID_REQUIRED });
        }
        try {
            const user = await this._favoritesService.removeFromFavorites(userId, listingId);
            return res.status(HttpStatusCodes.OK).json(user);
        } catch (error: any) {
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}