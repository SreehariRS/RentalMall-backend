"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    // Handle adding a favorite
    async addFavorite(req, res) {
        const { userId, listingId } = req.body;
        if (!userId || !listingId) {
            return res.status(400).json({ error: 'User ID and Listing ID are required.' });
        }
        try {
            const user = await this.userService.addToFavorites(userId, listingId);
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    // Handle removing a favorite
    async removeFavorite(req, res) {
        const { userId, listingId } = req.body;
        if (!userId || !listingId) {
            return res.status(400).json({ error: 'User ID and Listing ID are required.' });
        }
        try {
            const user = await this.userService.removeFromFavorites(userId, listingId);
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    // Fetch profile
    async getProfile(req, res) {
        try {
            // Retrieve session from Next.js
            // Fetch the user by email (session is available on req)
            const userData = await this.userService.findByEmail(req.user.email);
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
        }
        catch (error) {
            console.error("Error retrieving profile:", error);
            return res.status(500).json({
                status: false,
                message: "Failed to fetch profile",
                data: null,
            });
        }
    }
}
exports.UserController = UserController;
