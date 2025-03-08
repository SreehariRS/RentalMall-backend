import { Request, Response } from "express";
import { FavoritesService } from "../../services/user/favoritesService";

export class FavoritesController {
    private favoritesService: FavoritesService;

    constructor(favoritesService: FavoritesService) {
        this.favoritesService = favoritesService;
    }

    async addFavorite(req: Request, res: Response): Promise<Response> {
        const { userId, listingId } = req.body;
        if (!userId || !listingId) {
            return res.status(400).json({ error: "User ID and Listing ID are required." });
        }
        try {
            const user = await this.favoritesService.addToFavorites(userId, listingId);
            return res.status(200).json(user);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async removeFavorite(req: Request, res: Response): Promise<Response> {
        const { userId, listingId } = req.body;
        if (!userId || !listingId) {
            return res.status(400).json({ error: "User ID and Listing ID are required." });
        }
        try {
            const user = await this.favoritesService.removeFromFavorites(userId, listingId);
            return res.status(200).json(user);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}