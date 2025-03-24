import { Request, Response } from "express";
import { IPasswordService } from "../../services/interface/Iuser";
import { IPasswordController } from "../interface/IuserController";

export class PasswordController implements IPasswordController {
    private passwordService: IPasswordService;

    constructor(passwordService: IPasswordService) {
        this.passwordService = passwordService;
    }

    async changePassword(req: Request, res: Response): Promise<Response> {
        const { currentPassword, newPassword } = req.body;
        const userId = (req as any).user.userId;
        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({ error: "Current password and new password are required." });
        }
        try {
            const user = await this.passwordService.changePassword(userId, currentPassword, newPassword);
            return res.status(200).json({ status: true, message: "Password updated successfully.", data: user });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}