import { Request, Response } from "express";
import { IAuthService } from "../../services/interface/Iadmin";
import { IAuthController } from "../interface/IadminController";

export class AuthController implements IAuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      const tokens = await this.authService.login(email, password);
      if (!tokens) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      res.status(200).json({ message: "Login successful", ...tokens });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ message: "Refresh token is required" });
        return;
      }

      const result = await this.authService.refreshToken(refreshToken);
      if (!result) {
        res.status(401).json({ message: "Invalid or expired refresh token" });
        return;
      }

      res.status(200).json({ message: "Token refreshed", ...result });
    } catch (error) {
      console.error("Error in refresh:", error);
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
}