import { Request, Response } from 'express';
import { UserService } from '../services/userService';


export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  // Handle adding a favorite
  async addFavorite(req: Request, res: Response): Promise<Response> {
    const { userId, listingId } = req.body;

    if (!userId || !listingId) {
      return res.status(400).json({ error: 'User ID and Listing ID are required.' });
    }

    try {
      const user = await this.userService.addToFavorites(userId, listingId);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Handle removing a favorite
  async removeFavorite(req: Request, res: Response): Promise<Response> {
    const { userId, listingId } = req.body;

    if (!userId || !listingId) {
      return res.status(400).json({ error: 'User ID and Listing ID are required.' });
    }

    try {
      const user = await this.userService.removeFromFavorites(userId, listingId);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Fetch profile
  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      // Retrieve session from Next.js
      let email=(req as any).user.email
      // Fetch the user by email 
      const userData = await this.userService.findByEmail(email);
  
      if (!userData) {
        return res.status(404).json({
          status: false,
          message: "User not found.",
          data: null,
        });
      }

      if (userData.isBlocked) {
        return res.status(403).json({
          status: false,
          message: "User is blocked.",
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "User profile fetched successfully.",
        data: userData,
      });
    } catch (error) {
      console.error("Error retrieving profile:", error);
      return res.status(500).json({
        status: false,
        message: "Failed to fetch profile",
        data: null,
      });
    }
  }

  //handle change password
  async changePassword(req: Request, res: Response): Promise<Response> {
    const { newPassword } = req.body;
    const userId = (req as any).user.userId; // Get userId from JWT token
    console.log(userId)
    if (!userId || !newPassword) {
      return res.status(400).json({ error: 'New password is required.' });
    }
  
    try {
      const user = await this.userService.changePassword(userId, newPassword);
      return res.status(200).json({
        status: true,
        message: "Password updated successfully.",
        data: user,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
