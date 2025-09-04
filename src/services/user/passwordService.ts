import { IPasswordService } from "../interface/Iuser";
import { IPasswordRepository } from "../../repositories/interface/IUserRepositories";
import { generateVerificationToken } from "../../libs/Token";
import { sendForgotPasswordEmail } from "../../libs/mail";
import { getVerificationTokenByToken } from "../../libs/verification-token";
import bcrypt from "bcrypt";

export class PasswordService implements IPasswordService {
    private _passwordRepository: IPasswordRepository;

    constructor(passwordRepository: IPasswordRepository) {
        this._passwordRepository = passwordRepository;
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<any> {
        if (!userId || !currentPassword || !newPassword) {
            throw new Error("User ID, current password, and new password are required.");
        }
        return await this._passwordRepository.changePassword(userId, currentPassword, newPassword);
    }

    async forgotPassword(email: string): Promise<string> {
        const user = await this._passwordRepository.findUserByEmail(email);
        if (!user) {
            return "If an account exists, a reset link has been sent.";
        }
        const resetToken = await generateVerificationToken(email);
        await sendForgotPasswordEmail(email, resetToken.token);
        return "If an account exists, a reset link has been sent.";
    }

    async resetPassword(token: string, password: string): Promise<string> {
        const resetToken = await getVerificationTokenByToken(token);
        if (!resetToken || new Date() > resetToken.expires) {
            throw new Error("Invalid or expired token");
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        await this._passwordRepository.updatePassword(resetToken.email, hashedPassword);
        await this._passwordRepository.deleteToken(resetToken.id);
        return "Password reset successfully";
    }
}