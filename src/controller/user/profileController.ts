import { Request, Response } from "express";
import { IProfileService } from "../../services/interface/Iuser";
import { IProfileController } from "../interface/IuserController";
import { HttpStatusCodes } from "../../config/HttpStatusCodes";

export class ProfileController implements IProfileController {
    private _profileService: IProfileService;

    constructor(profileService: IProfileService) {
        this._profileService = profileService;
    }

    async getProfile(req: Request, res: Response): Promise<Response> {
        try {
            const email = (req as any).user.email;
            const userData = await this._profileService.findByEmail(email);
            if (!userData) {
                return res
                    .status(HttpStatusCodes.NOT_FOUND)
                    .json({ status: false, message: "User not found.", data: null });
            }
            if (userData.isBlocked) {
                return res
                    .status(HttpStatusCodes.FORBIDDEN)
                    .json({ status: false, message: "User is blocked.", data: null });
            }
            return res
                .status(HttpStatusCodes.OK)
                .json({ status: true, message: "User profile fetched successfully.", data: userData });
        } catch (error) {
            console.error("Error retrieving profile:", error);
            return res
                .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                .json({ status: false, message: "Failed to fetch profile", data: null });
        }
    }

    async updateProfileImage(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user.userId;
            const { imageUrl } = req.body;
            if (!imageUrl) {
                return res
                    .status(HttpStatusCodes.BAD_REQUEST)
                    .json({ status: false, message: "Image URL is required" });
            }
            const updatedUser = await this._profileService.updateProfileImage(userId, imageUrl);
            return res
                .status(HttpStatusCodes.OK)
                .json({ status: true, message: "Profile image updated successfully", data: updatedUser });
        } catch (error: any) {
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
        }
    }

    async updateAbout(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user.userId;
            const { about } = req.body;
            if (!about) {
                return res
                    .status(HttpStatusCodes.BAD_REQUEST)
                    .json({ status: false, message: "About text is required" });
            }
            const updatedUser = await this._profileService.updateAbout(userId, about);
            return res
                .status(HttpStatusCodes.OK)
                .json({ status: true, message: "About text updated successfully", data: updatedUser });
        } catch (error: any) {
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
        }
    }
}