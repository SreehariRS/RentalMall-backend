import { User } from "@prisma/client";
import { FavoritesRepository } from "../../repositories/user/favoritesRepository";

export class FavoritesService {
    private favoritesRepository: FavoritesRepository;

    constructor(favoritesRepository: FavoritesRepository) {
        this.favoritesRepository = favoritesRepository;
    }

    async addToFavorites(userId: string, listingId: string): Promise<User> {
        if (!userId || !listingId) {
            throw new Error("User ID and Listing ID are required.");
        }
        return await this.favoritesRepository.addFavorite(userId, listingId);
    }

    async removeFromFavorites(userId: string, listingId: string): Promise<User> {
        if (!userId || !listingId) {
            throw new Error("User ID and Listing ID are required.");
        }
        return await this.favoritesRepository.removeFavorite(userId, listingId);
    }
}