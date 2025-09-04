import { Request, Response } from "express";
import { IPasswordService } from "../../services/interface/Iuser";
import { IPasswordController } from "../interface/IuserController";
import { HttpStatusCodes } from "../../config/HttpStatusCodes";
import { Messages } from "../../config/message";

export class PasswordController implements IPasswordController {
    private _passwordService: IPasswordService;

    constructor(passwordService: IPasswordService) {
        this._passwordService = passwordService;
    }

    async changePassword(req: Request, res: Response): Promise<Response> {
        const { currentPassword, newPassword } = req.body;
        const userId = (req as any).user.userId;
        if (!userId || !currentPassword || !newPassword) {
            return res
                .status(HttpStatusCodes.BAD_REQUEST)
                .json({ error: Messages.CURRENT_NEW_PASSWORD_REQUIRED });
        }
        try {
            const user = await this._passwordService.changePassword(userId, currentPassword, newPassword);
            return res
                .status(HttpStatusCodes.OK)
                .json({ status: true, message: "Password updated successfully.", data: user });
        } catch (error: any) {
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<Response> {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: Messages.EMAIL_REQUIRED });
            }
            const message = await this._passwordService.forgotPassword(email);
            return res.status(HttpStatusCodes.OK).json({ message });
        } catch (error: unknown) {
            console.error("Error in forgotPassword:", error);
            return res
                .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: Messages.SOMETHING_WENT_WRONG });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<Response> {
        try {
            const { token, password } = req.body;
            if (!token || !password) {
                return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: Messages.TOKEN_PASSWORD_REQUIRED });
            }
            const message = await this._passwordService.resetPassword(token, password);
            return res.status(HttpStatusCodes.OK).json({ message });
        } catch (error: unknown) {
            console.error("Error in resetPassword:", error);
            return res
                .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: Messages.SOMETHING_WENT_WRONG });
        }
    }
}