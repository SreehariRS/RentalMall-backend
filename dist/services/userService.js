"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    // Add listing to favorites
    async addToFavorites(userId, listingId) {
        if (!userId || !listingId) {
            throw new Error("User ID and Listing ID are required.");
        }
        return await this.userRepository.addFavorite(userId, listingId);
    }
    // Remove listing from favorites
    async removeFromFavorites(userId, listingId) {
        if (!userId || !listingId) {
            throw new Error("User ID and Listing ID are required.");
        }
        return await this.userRepository.removeFavorite(userId, listingId);
    }
    async findByEmail(email) {
        const getUser = await this.userRepository.findByEmail(email);
        return getUser;
    }
}
exports.UserService = UserService;
