export interface ReviewDto {
	id: string;
	userId: string;
	listingId: string;
	reservationId: string;
	rating: number;
	title: string;
	content: string;
	createdAt?: string;
}

export interface CreateReviewRequestDto {
	userId: string;
	listingId: string;
	reservationId: string;
	rating: number;
	title: string;
	content: string;
}

export interface UpdateReviewRequestDto {
	reviewId: string;
	userId: string;
	rating: number;
	title: string;
	content: string;
}

export interface DeleteReviewRequestDto {
	reviewId: string;
	userId: string;
}

export interface GetReviewsRequestDto {
	listingId: string;
}
