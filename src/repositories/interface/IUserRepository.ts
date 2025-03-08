import { User, Listing } from "@prisma/client";
import { CreateListingParams, CreateMessageParams, CreateNotificationParams, CreateReservationParams, CreateReviewParams, DeleteNotificationParams, DeleteReviewParams, FilterListingsParams, GetNotificationsParams, GetReviewsParams, MarkMessageAsSeenParams, UpdateOfferPriceParams, UpdateReviewParams, WalletUpdateParams } from "../../services/interface/Iuser";

export interface UserRepository {
    addFavorite(userId: string, listingId: string): Promise<User>;
    removeFavorite(userId: string, listingId: string): Promise<User>;
    findByEmail(email: String): Promise<User | null>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<User>;
    findById(id: string): Promise<(Listing & { user: User | null }) | null>;
    create(data: any): Promise<Listing>;
    updateProfileImage(userId: string, imageUrl: string): Promise<User>;
    updateAbout(userId: string, about: string): Promise<User>;
    createListing(data: CreateListingParams): Promise<Listing>;
    createReservation(data: CreateReservationParams): Promise<any>;
    markMessageAsSeen(params: MarkMessageAsSeenParams): Promise<any>;
    createMessage(params: CreateMessageParams): Promise<any>;
    updateConversationLastMessage(conversationId: string, messageId: string): Promise<any>;
    getListingsByCategory(params: FilterListingsParams): Promise<any>;
    deleteNotification(params: DeleteNotificationParams): Promise<any>;
    getNotifications(params: GetNotificationsParams): Promise<any>;
    createNotification(params: CreateNotificationParams): Promise<any>;
    getNotificationCount(userId: string): Promise<number>;
    findReservationById(reservationId: string): Promise<any>;
    deleteReservation(reservationId: string): Promise<any>;
    refundToWallet(params: WalletUpdateParams): Promise<any>;
    createCancelledReservation(params: any): Promise<any>;
    createReview(params: CreateReviewParams): Promise<any>;
    updateReview(params: UpdateReviewParams): Promise<any>;
    deleteReview(params: DeleteReviewParams): Promise<any>;
    getReviews(params: GetReviewsParams): Promise<any>;
    findReviewById(reviewId: string): Promise<any>;
    updateOfferPrice(params: UpdateOfferPriceParams): Promise<any>;

}
