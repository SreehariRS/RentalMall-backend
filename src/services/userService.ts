import { UserRepository } from "../repositories/interface/IUserRepository";
import { User, Listing } from "@prisma/client";
import { CancelReservationParams, CreateListingParams ,CreateMessageParams,CreateNotificationParams,CreateReservationParams,CreateReviewParams,DeleteNotificationParams,DeleteReviewParams,FilterListingsParams,GetNotificationsParams,GetReviewsParams,MarkMessageAsSeenParams, UpdateOfferPriceParams, UpdateReviewParams} from "./interface/Iuser";




export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async addToFavorites(userId: string, listingId: string): Promise<User> {
        if (!userId || !listingId) {
            throw new Error("User ID and Listing ID are required.");
        }

        return await this.userRepository.addFavorite(userId, listingId);
    }

    async removeFromFavorites(userId: string, listingId: string): Promise<User> {
        if (!userId || !listingId) {
            throw new Error("User ID and Listing ID are required.");
        }

        return await this.userRepository.removeFavorite(userId, listingId);
    }
    async createReservation(params: CreateReservationParams): Promise<any> {
        return await this.userRepository.createReservation(params);
    }

    async findByEmail(email: String): Promise<User | null> {
        const getUser = await this.userRepository.findByEmail(email);
        return getUser;
    }
    //change password
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<User> {
        if (!userId || !currentPassword || !newPassword) {
            throw new Error("User ID, current password, and new password are required.");
        }

        const user = await this.userRepository.changePassword(userId, currentPassword, newPassword);
        return user;
    }
    //handle listing
    async getListingById(listingId: string): Promise<(Listing & { user: User | null }) | null> {
        return await this.userRepository.findById(listingId);
    }


    async createListing(params: CreateListingParams): Promise<Listing> {
        if (!params.imageSrc || !Array.isArray(params.imageSrc)) {
            throw new Error("Image sources must be provided as an array");
        }

        return await this.userRepository.create(params);
    }
    async getListingsByCategory(params: FilterListingsParams) {
        return await this.userRepository.getListingsByCategory(params);
    }
    async createMessage(params: CreateMessageParams) {
        return await this.userRepository.createMessage(params);
    }

    async updateConversationLastMessage(conversationId: string, messageId: string) {
        return await this.userRepository.updateConversationLastMessage(conversationId, messageId);
    }
    async markMessageAsSeen(params: MarkMessageAsSeenParams) {
        return await this.userRepository.markMessageAsSeen(params);
    }
    async updateProfileImage(userId: string, imageUrl: string): Promise<User> {
        if (!userId || !imageUrl) {
            throw new Error("User ID and Image URL are required.");
        }
        return await this.userRepository.updateProfileImage(userId, imageUrl);
    }
    async updateAbout(userId: string, about: string): Promise<User> {
        if (!userId || !about) {
          throw new Error("User ID and About text are required.");
        }
        return await this.userRepository.updateAbout(userId, about);
      }
      
      async getNotificationCount(userId: string): Promise<number> {
        if (!userId) {
            throw new Error("User ID is required.");
        }
        return await this.userRepository.getNotificationCount(userId);
    }
    async deleteNotification(params: DeleteNotificationParams) {
        return await this.userRepository.deleteNotification(params);
    }
    async getNotifications(params: GetNotificationsParams) {
        return await this.userRepository.getNotifications(params);
    }

    async createNotification(params: CreateNotificationParams) {
        return await this.userRepository.createNotification(params);
    }
    async cancelReservation(params: CancelReservationParams, currentUserId: string) {
        const reservation = await this.userRepository.findReservationById(params.reservationId);
        if (!reservation) throw new Error("Reservation not found");

        if (reservation.userId !== currentUserId && reservation.listing.userId !== currentUserId) {
            throw new Error("Unauthorized");
        }

        await getOrCreateWallet(reservation.userId);
        const updatedWallet = await this.userRepository.refundToWallet({
            userId: reservation.userId,
            amount: reservation.totalPrice,
        });

        await this.userRepository.createCancelledReservation({
            reservationId: reservation.id,
            userId: reservation.userId,
            listingId: reservation.listingId,
            startDate: reservation.startDate,
            endDate: reservation.endDate,
            totalPrice: reservation.totalPrice,
            cancelledBy: currentUserId,
            reason: "Cancelled by " + (currentUserId === reservation.userId ? "guest" : "host"),
        });

        await this.userRepository.deleteReservation(params.reservationId);

        if (currentUserId === reservation.listing.userId) {
            const notificationMessage = `Unfortunately, your reservation for "${reservation.listing.title}" has been canceled. The total amount of ₹${reservation.totalPrice} will be refunded to your wallet. We apologize for the inconvenience.`;
            await this.userRepository.createNotification(reservation.userId );
        }

        return { success: true, refundedAmount: reservation.totalPrice, newBalance: updatedWallet.balance };
    }
    async createReview(params: CreateReviewParams) {
        const existingReview = await this.userRepository.findReviewById(params.reservationId);
        if (existingReview) {
            throw new Error("You have already reviewed this reservation");
        }

        return await this.userRepository.createReview(params);
    }

    async updateReview(params: UpdateReviewParams, currentUserId: string) {
        const review = await this.userRepository.findReviewById(params.reviewId);
        if (!review) throw new Error("Review not found");
        if (review.userId !== currentUserId) throw new Error("Unauthorized");

        return await this.userRepository.updateReview(params);
    }

    async deleteReview(params: DeleteReviewParams, currentUserId: string) {
        const review = await this.userRepository.findReviewById(params.reviewId);
        if (!review) throw new Error("Review not found");
        if (review.userId !== currentUserId) throw new Error("Unauthorized");

        return await this.userRepository.deleteReview(params);
    }

    async getReviews(params: GetReviewsParams) {
        return await this.userRepository.getReviews(params);
    }
   
    async updateOfferPrice(params: UpdateOfferPriceParams) {
        if (params.offerPrice !== null && (typeof params.offerPrice !== "number" || params.offerPrice <= 0)) {
            throw new Error("Invalid offer price");
        }

        const listing = await this.userRepository.updateOfferPrice(params);

        if (listing.count === 0) {
            throw new Error("Listing not found or unauthorized");
        }

        return { message: "Offer price updated successfully" };
    }
}
    function getOrCreateWallet(userId: any) {
    throw new Error("Function not implemented.");
}
