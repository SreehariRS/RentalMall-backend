
import { IPasswordService } from "../interface/Iuser";
import { IPasswordRepository } from "../../repositories/interface/IUserRepositories";

export class PasswordService implements IPasswordService {
    private passwordRepository: IPasswordRepository;

    constructor(passwordRepository: IPasswordRepository) {
        this.passwordRepository = passwordRepository;
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<any> {
        if (!userId || !currentPassword || !newPassword) {
            throw new Error("User ID, current password, and new password are required.");
        }
        return await this.passwordRepository.changePassword(userId, currentPassword, newPassword);
    }
}