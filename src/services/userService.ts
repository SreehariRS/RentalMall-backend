
import { UserRepository } from "../repositories/interface/userRepository";
import { User } from "@prisma/client";

export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    // Add listing to favorites
    async addToFavorites(userId: string, listingId: string): Promise<User> {
        if (!userId || !listingId) {
            throw new Error("User ID and Listing ID are required.");
        }

        return await this.userRepository.addFavorite(userId, listingId);
    }

    // Remove listing from favorites
    async removeFromFavorites(userId: string, listingId: string): Promise<User> {
        if (!userId || !listingId) {
            throw new Error("User ID and Listing ID are required.");
        }

        return await this.userRepository.removeFavorite(userId, listingId);
    }

    async findByEmail(email: String): Promise<User | null> {
        const getUser = await this.userRepository.findByEmail(email);
        return getUser;
    }

    async changePassword(userId: string, newPassword: string): Promise<User> {
        if (!userId || !newPassword) {
          throw new Error("User ID and new password are required.");
        }
    
        return await this.userRepository.changePassword(userId, newPassword);
      }
}
