
import { IProfileService } from "../interface/Iuser";
import { IProfileRepository } from "../../repositories/interface/IUserRepositories";

export class ProfileService implements IProfileService {
    private profileRepository: IProfileRepository;

    constructor(profileRepository: IProfileRepository) {
        this.profileRepository = profileRepository;
    }

    async findByEmail(email: string): Promise<any> {
        return await this.profileRepository.findByEmail(email);
    }

    async updateProfileImage(userId: string, imageUrl: string): Promise<any> {
        if (!userId || !imageUrl) {
            throw new Error("User ID and Image URL are required.");
        }
        return await this.profileRepository.updateProfileImage(userId, imageUrl);
    }

    async updateAbout(userId: string, about: string): Promise<any> {
        if (!userId || !about) {
            throw new Error("User ID and About text are required.");
        }
        return await this.profileRepository.updateAbout(userId, about);
    }
}