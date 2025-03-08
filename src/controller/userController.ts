import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { razorpay } from "../config/razorPay";
import { pusherServer } from "../libs/pusher";
import { FilterListingsParams } from "../services/interface/Iuser";
import prisma from "../libs/prismadb";



export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    // Handle adding a favorite
    async addFavorite(req: Request, res: Response): Promise<Response> {
        const { userId, listingId } = req.body;

        if (!userId || !listingId) {
            return res.status(400).json({ error: "User ID and Listing ID are required." });
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
            return res.status(400).json({ error: "User ID and Listing ID are required." });
        }

        try {
            const user = await this.userService.removeFromFavorites(userId, listingId);
            return res.status(200).json(user);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getListingsByCategory(req: Request, res: Response): Promise<Response> {
        try {
            const { category } = req.query;

            const listings = await this.userService.getListingsByCategory({
                category: category as string,
            });

            return res.status(200).json(listings);
        } catch (error) {
            console.error("Error fetching listings by category:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }


    async createReservation(req: Request, res: Response): Promise<Response> {
        try {
            const reservation = await this.userService.createReservation(req.body);
            return res.status(201).json(reservation);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async createMessage(req: Request, res: Response): Promise<Response> {
        try {
            const { message, image, conversationId } = req.body;
            const currentUser = (req as any).user;

            if (!currentUser?.id || !currentUser?.email) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const newMessage = await this.userService.createMessage({
                message,
                image,
                conversationId,
                senderId: currentUser.id,
            });

            const updatedConversation = await this.userService.updateConversationLastMessage(
                conversationId,
                newMessage.id
            );

            await pusherServer.trigger(conversationId, "messages:new", newMessage);
            const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

            updatedConversation.users.map((user: { email: string | string[]; }) => {
                pusherServer.trigger(user.email!, "conversation:update", {
                    id: conversationId,
                    messages: [lastMessage],
                });
            });

            return res.status(200).json(newMessage);
        } catch (error) {
            console.error("Error creating message:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    // Fetch profile
    async getProfile(req: Request, res: Response): Promise<Response> {
        try {
            // Retrieve session from Next.js
            let email = (req as any).user.email;
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
        const { currentPassword, newPassword } = req.body;
        const userId = (req as any).user.userId;

        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({ error: "Current password and new password are required." });
        }

        try {
            const user = await this.userService.changePassword(userId, currentPassword, newPassword);
            return res.status(200).json({
                status: true,
                message: "Password updated successfully.",
                data: user,
            });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
    //handle listing
    async getListingById(req: Request, res: Response): Promise<Response> {
        const { listingId } = req.params;

        if (!listingId) {
            return res.status(400).json({ error: "Listing ID is required." });
        }

        try {
            const listing = await this.userService.getListingById(listingId);

            if (!listing) {
                return res.status(404).json({ error: "Listing not found." });
            }

            return res.status(200).json(listing);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async createListing(req: Request, res: Response): Promise<Response> {
        try {
            const { title, description, imageSrc, category, roomCount, guestCount, location, price } = req.body;

            const userId = (req as any).user.id;

            const listing = await this.userService.createListing({
                title,
                description,
                imageSrc,
                category,
                roomCount,
                guestCount,
                location,
                price,
                userId,
                locationValues: undefined
            });

            return res.status(201).json(listing);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
    
    async markMessageAsSeen(req: Request, res: Response): Promise<Response> {
        try {
            const { conversationId } = req.params;
            const currentUser = (req as any).user;

            if (!currentUser?.id || !currentUser?.email) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const updatedMessage = await this.userService.markMessageAsSeen({
                conversationId,
                userId: currentUser.id,
                userEmail: currentUser.email,
            });

            await pusherServer.trigger(currentUser.email, "conversation:update", {
                id: conversationId,
                message: [updatedMessage],
            });

            await pusherServer.trigger(conversationId, "message:update", updatedMessage);

            return res.status(200).json(updatedMessage);
        } catch (error) {
            console.error("Error marking message as seen:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async updateProfileImage(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user.userId;
            const { imageUrl } = req.body;

            if (!imageUrl) {
                return res.status(400).json({
                    status: false,
                    message: "Image URL is required",
                });
            }

            const updatedUser = await this.userService.updateProfileImage(userId, imageUrl);

            return res.status(200).json({
                status: true,
                message: "Profile image updated successfully",
                data: updatedUser,
            });
        } catch (error: any) {
            return res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    }
    async updateAbout(req: Request, res: Response): Promise<Response> {
        try {
          const userId = (req as any).user.userId;
          const { about } = req.body;
      
          if (!about) {
            return res.status(400).json({ 
              status: false, 
              message: "About text is required" 
            });
          }
      
          const updatedUser = await this.userService.updateAbout(userId, about);
          
          return res.status(200).json({
            status: true,
            message: "About text updated successfully",
            data: updatedUser
          });
        } catch (error: any) {
          return res.status(500).json({ 
            status: false, 
            message: error.message 
          });
        }
      }

      
      async getNotificationCount(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user.userId;
            const count = await this.userService.getNotificationCount(userId);

            return res.status(200).json({
                status: true,
                message: "Notification count fetched successfully",
                data: { count },
            });
        } catch (error: any) {
            return res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    }

    async createOrder(req: Request, res: Response): Promise<void> {
        const options = {
            amount: req.body.amount * 100,
            currency: req.body.currency || "INR",
            receipt: `txn_${Date.now()}`,
            payment_capture: 1,
        };

        try {
            const order = await razorpay.orders.create(options);
            res.status(200).json({
                order_id: order.id,
                currency: order.currency,
                amount: order.amount,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to create order" });
        }
    }
    async deleteNotification(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;

            if (!currentUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const { notificationId } = req.params;
            if (!notificationId || typeof notificationId !== "string") {
                return res.status(400).json({ message: "Invalid ID" });
            }

            const notification = await this.userService.deleteNotification({
                notificationId,
                userId: currentUser.id,
            });

            await pusherServer.trigger(
                `user-${currentUser.email}-notifications`,
                "notification:remove",
                notificationId
            );

            return res.status(200).json(notification);
        } catch (error) {
            console.error("DELETE_NOTIFICATION_ERROR", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    async getNotifications(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;

            if (!currentUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const notifications = await this.userService.getNotifications({ userId: currentUser.id });

            return res.status(200).json(notifications);
        } catch (error) {
            console.error("GET_NOTIFICATIONS_ERROR", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async createNotification(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;

            if (!currentUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const { userId, message, type } = req.body;

            if (!userId || !message) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const notification = await this.userService.createNotification({
                userId,
                message,
                type,
            });

            const recipient = await prisma.user.findUnique({
                where: { id: userId },
                select: { email: true },
            });

            if (recipient?.email) {
                await pusherServer.trigger(
                    `user-${recipient.email}-notifications`,
                    "notification:new",
                    notification
                );
            }

            return res.status(200).json(notification);
        } catch (error) {
            console.error("CREATE_NOTIFICATION_ERROR", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    async cancelReservation(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const { reservationId } = req.params;
            if (!reservationId || typeof reservationId !== "string") {
                return res.status(400).json({ message: "Invalid ID" });
            }

            const result = await this.userService.cancelReservation({ reservationId, userId: currentUser.id }, currentUser.id);

            await pusherServer.trigger(`user-${currentUser.email}-notifications`, "notification:new", {
                message: "Your reservation has been canceled.",
            });

            return res.status(200).json(result);
        } catch (error) {
            console.error("CANCEL_RESERVATION_ERROR", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    async createReview(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }
    
            const result = await this.userService.createReview({ ...req.body, userId: currentUser.id });
    
            return res.status(200).json(result);
        } catch (error) {
            console.error("CREATE_REVIEW_ERROR", error);
    
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            
            return res.status(500).json({ message: errorMessage });
        }
    }
    

    async updateReview(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }
    
            const result = await this.userService.updateReview(req.body, currentUser.id);
            return res.status(200).json(result);
        } catch (error) {
            console.error("UPDATE_REVIEW_ERROR", error);
    
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    
            return res.status(500).json({ message: errorMessage });
        }
    }
    
    async deleteReview(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }
    
            await this.userService.deleteReview({ reviewId: req.params.reviewId, userId: currentUser.id }, currentUser.id);
            return res.status(200).json({ message: "Review deleted successfully" });
        } catch (error) {
            console.error("DELETE_REVIEW_ERROR", error);
            
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            return res.status(500).json({ message: errorMessage });
        }
    }
    
    async getReviews(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.userService.getReviews({ listingId: req.params.listingId });
            return res.status(200).json(result);
        } catch (error) {
            console.error("GET_REVIEWS_ERROR", error);
    
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            return res.status(500).json({ message: errorMessage });
        }
    }
    async updateOfferPrice(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }
    
            const { listingId } = req.params;
            if (!listingId || typeof listingId !== "string") {
                return res.status(400).json({ message: "Invalid ID" });
            }
    
            const { offerPrice } = req.body;
            const result = await this.userService.updateOfferPrice({ listingId, userId: currentUser.id, offerPrice });
    
            return res.status(200).json(result);
        } catch (error) {
            console.error("UPDATE_OFFER_PRICE_ERROR", error);
    
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            return res.status(500).json({ message: errorMessage });
        }
    }
    
    
}