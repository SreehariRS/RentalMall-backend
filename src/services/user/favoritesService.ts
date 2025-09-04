import { IFavoritesService } from "../interface/Iuser";
import { IFavoritesRepository } from "../../repositories/interface/IUserRepositories";

export class FavoritesService implements IFavoritesService {
    private _favoritesRepository: IFavoritesRepository;

    constructor(favoritesRepository: IFavoritesRepository) {
        this._favoritesRepository = favoritesRepository;
    }

    async addToFavorites(userId: string, listingId: string): Promise<any> {
        if (!userId || !listingId) {
            throw new Error("User ID and Listing ID are required.");
        }
        return await this._favoritesRepository.addFavorite(userId, listingId);
    }

    async removeFromFavorites(userId: string, listingId: string): Promise<any> {
        if (!userId || !listingId) {
            throw new Error("User ID and Listing ID are required.");
        }
        return await this._favoritesRepository.removeFavorite(userId, listingId);
    }
}