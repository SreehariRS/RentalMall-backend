import {
    User,
    Listing,
    Reservation,
    Message,
    Conversation,
    Notification,
    Review,
    Wallet,
    CancelledReservation,
    ReviewResponse,
} from "@prisma/client";
import {
    CreateListingParams,
    CreateMessageParams,
    CreateNotificationParams,
    CreateReservationParams,
    CreateReviewParams,
    DeleteNotificationParams,
    DeleteReviewParams,
    FilterListingsParams,
    GetNotificationsParams,
    GetReviewsParams,
    MarkMessageAsSeenParams,
    UpdateReviewParams,
    WalletUpdateParams,
} from "../../services/interface/Iuser";

export interface IFavoritesRepository {
    addFavorite(userId: string, listingId: string): Promise<User>;
    removeFavorite(userId: string, listingId: string): Promise<User>;
}

export interface IListingsRepository {
    getListingsByCategory(params: FilterListingsParams): Promise<Listing[]>;
    updatePrice(listingId: string, userId: string, price: number): Promise<{ count: number }>;
    findById(id: string): Promise<(Listing & { user: User | null }) | null>;
    createListing(data: CreateListingParams): Promise<Listing>;
    findReservationsByListingId(
        listingId: string
    ): Promise<(Reservation & { user: { id: string; email: string | null }; listing: Listing })[]>;
    createNotification(params: {
        userId: string;
        message: string;
        type: string;
        isRead: boolean;
    }): Promise<Notification>;
    deleteListing(listingId: string, userId: string): Promise<{ count: number }>;
    updateListing(listingId: string, userId: string, data: any): Promise<{ count: number }>;
}
export interface IResetPasswordRepository {
    updatePassword(email: string, hashedPassword: string): Promise<any>;
    deleteToken(tokenId: string): Promise<any>;
}

export interface IMessagesRepository {
    createMessage(params: CreateMessageParams): Promise<Message & { seen: User[]; sender: User }>;
    updateConversationLastMessage(
        conversationId: string,
        messageId: string
    ): Promise<Conversation & { users: User[]; messages: (Message & { seen: User[] })[] }>;
    markMessageAsSeen(
        params: MarkMessageAsSeenParams
    ): Promise<(Message & { sender: User; seen: User[] }) | Conversation>;
}

export interface INotificationsRepository {
    getNotificationCount(userId: string): Promise<number>;
    deleteNotification(params: DeleteNotificationParams): Promise<{ count: number }>;
    getNotifications(params: GetNotificationsParams): Promise<Notification[]>;
    createNotification(params: CreateNotificationParams): Promise<Notification>;
}

export interface IOfferRepository {
    updateOfferPrice(params: {
        listingId: string;
        userId: string;
        offerPrice: number | null;
    }): Promise<{ count: number }>;
}

export interface IPasswordRepository {
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<User>;
    findUserByEmail(email: string): Promise<User | null>;
    updatePassword(email: string, hashedPassword: string): Promise<User>;
    deleteToken(tokenId: string): Promise<any>;
}

export interface IPaymentRepository {
    createOrder(options: {
        amount: number;
        currency: string;
        receipt: string;
        payment_capture: number;
    }): Promise<{ id: string; currency: string; amount: number }>;
}

export interface IProfileRepository {
    findByEmail(email: string): Promise<User | null>;
    updateProfileImage(userId: string, imageUrl: string): Promise<User>;
    updateAbout(userId: string, about: string): Promise<User>;
}

export interface IReservationsRepository {
    createReservation(data: CreateReservationParams): Promise<Reservation>;
    findReservationById(
        reservationId: string
    ): Promise<(Reservation & { listing: Listing; user: { email: string; id: string } }) | null>;
    deleteReservation(reservationId: string): Promise<Reservation>;
    refundToWallet(params: WalletUpdateParams): Promise<Wallet>;
    createCancelledReservation(params: {
        reservationId: string;
        userId: string;
        listingId: string;
        startDate: Date;
        endDate: Date;
        totalPrice: number;
        cancelledBy: string;
        reason?: string;
    }): Promise<CancelledReservation>;
    createNotification(params: CreateNotificationParams): Promise<Notification>;
    getOrCreateWallet(userId: string): Promise<Wallet>;
}

export interface IReviewsRepository {
    findListingById(listingId: string): Promise<Listing | null>;
    createReviewResponse(params: { reviewId: string; userId: string; content: string }): Promise<ReviewResponse>;
    findReviewByReservation(userId: string, reservationId: string): Promise<Review | null>;
    createReview(params: CreateReviewParams): Promise<Review>;
    updateReview(params: UpdateReviewParams): Promise<Review>;
    deleteReview(params: DeleteReviewParams): Promise<Review>;
    getReviews(params: GetReviewsParams): Promise<
        {
            id: string;
            author: string;
            date: string;
            rating: number;
            title: string;
            content: string;
            helpfulCount: number;
            verified: boolean;
            userId: string;
        }[]
    >;
    findReviewById(reviewId: string): Promise<Review | null>;
}
export interface IForgotPasswordRepository {
    findUserByEmail(email: string): Promise<any | null>;
}
