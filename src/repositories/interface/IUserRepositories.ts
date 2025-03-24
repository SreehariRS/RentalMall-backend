// src/repositories/interface/IUserRepositories.ts

import { User, Listing, Reservation, Message, Conversation, Notification, Review, Wallet, CancelledReservation } from "@prisma/client";
import {
    CreateListingParams, CreateMessageParams, CreateNotificationParams, CreateReservationParams,
    CreateReviewParams, DeleteNotificationParams, DeleteReviewParams, FilterListingsParams,
    GetNotificationsParams, GetReviewsParams, MarkMessageAsSeenParams, UpdateOfferPriceParams,
    UpdateReviewParams, WalletUpdateParams
} from "../../services/interface/Iuser";

export interface IFavoritesRepository {
    addFavorite(userId: string, listingId: string): Promise<User>;
    removeFavorite(userId: string, listingId: string): Promise<User>;
}

export interface IListingsRepository {
    getListingsByCategory(params: FilterListingsParams): Promise<Listing[]>;
    findById(id: string): Promise<(Listing & { user: User | null }) | null>;
    createListing(data: CreateListingParams): Promise<Listing>;
}

export interface IMessagesRepository {
    createMessage(params: CreateMessageParams): Promise<Message & { seen: User[]; sender: User }>;
    updateConversationLastMessage(conversationId: string, messageId: string): Promise<Conversation & { users: User[]; messages: (Message & { seen: User[] })[] }>;
    markMessageAsSeen(params: MarkMessageAsSeenParams): Promise<Message & { sender: User; seen: User[] } | Conversation>;
}

export interface INotificationsRepository {
    getNotificationCount(userId: string): Promise<number>;
    deleteNotification(params: DeleteNotificationParams): Promise<{ count: number }>;
    getNotifications(params: GetNotificationsParams): Promise<Notification[]>;
    createNotification(params: CreateNotificationParams): Promise<Notification>;
}

export interface IOfferRepository {
    updateOfferPrice(params: UpdateOfferPriceParams): Promise<{ count: number }>;
}

export interface IPasswordRepository {
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<User>;
}

export interface IPaymentRepository {
    createOrder(options: { amount: number; currency: string; receipt: string; payment_capture: number }): Promise<{ id: string; currency: string; amount: number }>;
}

export interface IProfileRepository {
    findByEmail(email: string): Promise<User | null>;
    updateProfileImage(userId: string, imageUrl: string): Promise<User>;
    updateAbout(userId: string, about: string): Promise<User>;
}

export interface IReservationsRepository {
    createReservation(data: CreateReservationParams): Promise<Reservation>;
    findReservationById(reservationId: string): Promise<(Reservation & { listing: Listing; user: { email: string; id: string } }) | null>;
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
    createReview(params: CreateReviewParams): Promise<Review>;
    updateReview(params: UpdateReviewParams): Promise<Review>;
    deleteReview(params: DeleteReviewParams): Promise<Review>;
    getReviews(params: GetReviewsParams): Promise<{
        id: string;
        author: string;
        date: string;
        rating: number;
        title: string;
        content: string;
        helpfulCount: number;
        verified: boolean;
        userId: string;
    }[]>;
    findReviewById(reviewId: string): Promise<Review | null>;
}