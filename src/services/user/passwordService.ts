import { User } from "@prisma/client";
import { PasswordRepository } from "../../repositories/user/passwordRepository";

export class PasswordService {
    private passwordRepository: PasswordRepository;

    constructor(passwordRepository: PasswordRepository) {
        this.passwordRepository = passwordRepository;
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<User> {
        if (!userId || !currentPassword || !newPassword) {
            throw new Error("User ID, current password, and new password are required.");
        }
        return await this.passwordRepository.changePassword(userId, currentPassword, newPassword);
    }
}