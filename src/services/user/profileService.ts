import { User } from "@prisma/client";
import { ProfileRepository } from "../../repositories/user/profileRepository";

export class ProfileService {
    private profileRepository: ProfileRepository;

    constructor(profileRepository: ProfileRepository) {
        this.profileRepository = profileRepository;
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.profileRepository.findByEmail(email);
    }

    async updateProfileImage(userId: string, imageUrl: string): Promise<User> {
        if (!userId || !imageUrl) {
            throw new Error("User ID and Image URL are required.");
        }
        return await this.profileRepository.updateProfileImage(userId, imageUrl);
    }

    async updateAbout(userId: string, about: string): Promise<User> {
        if (!userId || !about) {
            throw new Error("User ID and About text are required.");
        }
        return await this.profileRepository.updateAbout(userId, about);
    }
}