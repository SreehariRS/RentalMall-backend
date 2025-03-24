import { Request, Response } from "express";
import { IProfileService } from "../../services/interface/Iuser";
import { IProfileController } from "../interface/IuserController";

export class ProfileController implements IProfileController {
    private profileService: IProfileService;

    constructor(profileService: IProfileService) {
        this.profileService = profileService;
    }

    async getProfile(req: Request, res: Response): Promise<Response> {
        try {
            const email = (req as any).user.email;
            const userData = await this.profileService.findByEmail(email);
            if (!userData) {
                return res.status(404).json({ status: false, message: "User not found.", data: null });
            }
            if (userData.isBlocked) {
                return res.status(403).json({ status: false, message: "User is blocked.", data: null });
            }
            return res.status(200).json({ status: true, message: "User profile fetched successfully.", data: userData });
        } catch (error) {
            console.error("Error retrieving profile:", error);
            return res.status(500).json({ status: false, message: "Failed to fetch profile", data: null });
        }
    }

    async updateProfileImage(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user.userId;
            const { imageUrl } = req.body;
            if (!imageUrl) {
                return res.status(400).json({ status: false, message: "Image URL is required" });
            }
            const updatedUser = await this.profileService.updateProfileImage(userId, imageUrl);
            return res.status(200).json({ status: true, message: "Profile image updated successfully", data: updatedUser });
        } catch (error: any) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }

    async updateAbout(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user.userId;
            const { about } = req.body;
            if (!about) {
                return res.status(400).json({ status: false, message: "About text is required" });
            }
            const updatedUser = await this.profileService.updateAbout(userId, about);
            return res.status(200).json({ status: true, message: "About text updated successfully", data: updatedUser });
        } catch (error: any) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }
}