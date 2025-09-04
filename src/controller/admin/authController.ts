import { Request, Response } from "express";
import { IAuthService } from "../../services/interface/Iadmin";
import { IAuthController } from "../interface/IadminController";
import { AdminLoginRequestDto, AdminRefreshRequestDto } from "../../dto/admin";
import { HttpStatusCodes } from "../../config/HttpStatusCodes";
import { Messages } from "../../config/message";

export class AuthController implements IAuthController {
  private _authService: IAuthService;

  constructor(authService: IAuthService) {
    this._authService = authService;
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: AdminLoginRequestDto = req.body;
      if (!email || !password) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: Messages.EMAIL_PASSWORD_REQUIRED });
        return;
      }

      const tokens = await this._authService.login(email, password);
      if (!tokens) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: Messages.INVALID_EMAIL_PASSWORD });
        return;
      }

      res.status(HttpStatusCodes.OK).json(tokens);
    } catch (error) {
      console.error("Error in login:", error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.UNEXPECTED_ERROR });
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken }: AdminRefreshRequestDto = req.body;
      if (!refreshToken) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: Messages.REFRESH_TOKEN_REQUIRED });
        return;
      }

      const result = await this._authService.refreshToken(refreshToken);
      if (!result) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: Messages.INVALID_EXPIRED_REFRESH_TOKEN });
        return;
      }

      res.status(HttpStatusCodes.OK).json(result);
    } catch (error) {
      console.error("Error in refresh:", error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.UNEXPECTED_ERROR });
    }
  }
}