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

