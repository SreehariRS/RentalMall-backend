
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

export interface UpdateOfferPriceParams {
    listingId: string;
    userId: string;
    offerPrice: number | null;
}

// Service Interfaces
export interface IFavoritesService {
    addToFavorites(userId: string, listingId: string): Promise<any>;
    removeFromFavorites(userId: string, listingId: string): Promise<any>;
}

export interface IListingsService {
    getListingsByCategory(params: FilterListingsParams): Promise<any>;
    getListingById(listingId: string): Promise<any>;
    createListing(params: CreateListingParams): Promise<any>;
}

export interface IMessagesService {
    createMessage(params: CreateMessageParams): Promise<any>;
    updateConversationLastMessage(conversationId: string, messageId: string): Promise<any>;
    markMessageAsSeen(params: MarkMessageAsSeenParams): Promise<any>;
}

export interface INotificationsService {
    getNotificationCount(userId: string): Promise<number>;
    deleteNotification(params: DeleteNotificationParams): Promise<any>;
    getNotifications(params: GetNotificationsParams): Promise<any>;
    createNotification(params: CreateNotificationParams): Promise<any>;
}

export interface IOfferService {
    updateOfferPrice(params: UpdateOfferPriceParams): Promise<any>;
}

export interface IPasswordService {
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<any>;
}

export interface IPaymentService {
    createOrder(body: { amount: number; currency?: string }, res: any): Promise<void>;
}

export interface IProfileService {
    findByEmail(email: string): Promise<any>;
    updateProfileImage(userId: string, imageUrl: string): Promise<any>;
    updateAbout(userId: string, about: string): Promise<any>;
}

export interface IReservationsService {
    createReservation(params: CreateReservationParams): Promise<any>;
    cancelReservation(params: CancelReservationParams, currentUserId: string): Promise<any>;
}

export interface IReviewsService {
    createReview(params: CreateReviewParams): Promise<any>;
    updateReview(params: UpdateReviewParams, currentUserId: string): Promise<any>;
    deleteReview(params: DeleteReviewParams, currentUserId: string): Promise<any>;
    getReviews(params: GetReviewsParams): Promise<any>;
}