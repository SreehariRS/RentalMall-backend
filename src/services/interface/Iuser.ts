import {
    ListingListResponseDto,
    ListingResponseDto,
    UpdateMessageResponseDto,
    DeleteResultDto,
} from "../../dto/user/ListingsDto";
import { MessageDto } from "../../dto/user/MessagesDto";
import { NotificationDto } from "../../dto/user/NotificationsDto";
import { UserProfileDto } from "../../dto/user/ProfileDto";
import { UpdateOfferPriceResponseDto } from "../../dto/user/OffersDto";
import { ReservationDto, CancelReservationResponseDto } from "../../dto/user/ReservationsDto";
import { ReviewDto } from "../../dto/user/ReviewsDto";

export interface CreateListingParams {
    locationValues: any;
    title: string;
    description: string;
    imageSrc: string[];
    category: string;
    roomCount: number;
    guestCount: number;
    location: { value: string };
    price: number;
    userId: string;
}

export interface CreateReservationParams {
    userId: string;
    listingId: string;
    startDate: Date;
    endDate: Date;
    locationValues: string;
    totalPrice: number;
    orderId: string;
    paymentId?: string;
    status: string;
}

export interface CreateMessageParams {
    message?: string;
    image?: string;
    conversationId: string;
    senderId: string;
}

export interface MarkMessageAsSeenParams {
    conversationId: string;
    userId: string;
    userEmail: string;
}

export interface FilterListingsParams {
    category?: string;
}

export interface DeleteNotificationParams {
    notificationId: string;
    userId: string;
}

export interface CreateNotificationParams {
    userId: string;
    message: string;
    type?: string;
}

export interface GetNotificationsParams {
    userId: string;
}

export interface CancelReservationParams {
    reservationId: string;
    userId: string;
}

export interface WalletUpdateParams {
    userId: string;
    amount: number;
}

export interface CreateReviewParams {
    userId: string;
    listingId: string;
    reservationId: string;
    rating: number;
    title: string;
    content: string;
}

export interface UpdateReviewParams {
    reviewId: string;
    userId: string;
    rating: number;
    title: string;
    content: string;
}

export interface DeleteReviewParams {
    reviewId: string;
    userId: string;
}

export interface GetReviewsParams {
    listingId: string;
}

// Service Interfaces
export interface IFavoritesService {
    addToFavorites(userId: string, listingId: string): Promise<any>;
    removeFromFavorites(userId: string, listingId: string): Promise<any>;
}

export interface IListingsService {
    getListingsByCategory(params: FilterListingsParams): Promise<ListingListResponseDto>;
    getListingById(listingId: string): Promise<ListingResponseDto | null>;
    createListing(params: CreateListingParams): Promise<ListingResponseDto>;
    updatePrice(listingId: string, userId: string, price: number): Promise<UpdateMessageResponseDto>;
    deleteListing(listingId: string, userId: string): Promise<DeleteResultDto>;
    updateListing(listingId: string, userId: string, data: any): Promise<UpdateMessageResponseDto>;
}

export interface IMessagesService {
    createMessage(params: CreateMessageParams): Promise<MessageDto>;
    updateConversationLastMessage(conversationId: string, messageId: string): Promise<any>;
    markMessageAsSeen(params: MarkMessageAsSeenParams): Promise<any>;
}

export interface INotificationsService {
    getNotificationCount(userId: string): Promise<number>;
    deleteNotification(params: DeleteNotificationParams): Promise<any>;
    getNotifications(params: GetNotificationsParams): Promise<NotificationDto[]>;
    createNotification(params: CreateNotificationParams): Promise<NotificationDto>;
}

export interface IOfferService {
    updateOfferPrice(params: {
        listingId: string;
        userId: string;
        offerPrice: number | null;
    }): Promise<UpdateOfferPriceResponseDto>;
}

export interface IPasswordService {
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<any>;
    forgotPassword(email: string): Promise<string>;
    resetPassword(token: string, password: string): Promise<string>;
}

export interface IPaymentService {
    createOrder(body: { amount: number; currency?: string }, res: any): Promise<void>;
}

export interface IProfileService {
    findByEmail(email: string): Promise<UserProfileDto | null>;
    updateProfileImage(userId: string, imageUrl: string): Promise<UserProfileDto>;
    updateAbout(userId: string, about: string): Promise<UserProfileDto>;
}

export interface IReservationsService {
    createReservation(params: CreateReservationParams): Promise<ReservationDto>;
    cancelReservation(params: CancelReservationParams, currentUserId: string): Promise<CancelReservationResponseDto>;
}

export interface IReviewsService {
    createReview(params: CreateReviewParams): Promise<ReviewDto>;
    createReviewOrResponse(userId: string, params: any): Promise<any>;
    updateReview(params: UpdateReviewParams, currentUserId: string): Promise<ReviewDto>;
    deleteReview(params: DeleteReviewParams, currentUserId: string): Promise<any>;
    getReviews(params: GetReviewsParams): Promise<any>;
}
export interface IForgotPasswordService {
    forgotPassword(email: string): Promise<string>;
}
export interface IResetPasswordService {
    resetPassword(token: string, password: string): Promise<string>;
}
