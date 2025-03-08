import { CreateReviewParams, UpdateReviewParams, DeleteReviewParams, GetReviewsParams } from "../interface/Iuser";
import { ReviewsRepository } from "../../repositories/user/reviewsRepository";

export class ReviewsService {
    private reviewsRepository: ReviewsRepository;

    constructor(reviewsRepository: ReviewsRepository) {
        this.reviewsRepository = reviewsRepository;
    }

    async createReview(params: CreateReviewParams) {
        const existingReview = await this.reviewsRepository.findReviewById(params.reservationId);
        if (existingReview) throw new Error("You have already reviewed this reservation");
        return await this.reviewsRepository.createReview(params);
    }

    async updateReview(params: UpdateReviewParams, currentUserId: string) {
        const review = await this.reviewsRepository.findReviewById(params.reviewId);
        if (!review) throw new Error("Review not found");
        if (review.userId !== currentUserId) throw new Error("Unauthorized");
        return await this.reviewsRepository.updateReview(params);
    }

    async deleteReview(params: DeleteReviewParams, currentUserId: string) {
        const review = await this.reviewsRepository.findReviewById(params.reviewId);
        if (!review) throw new Error("Review not found");
        if (review.userId !== currentUserId) throw new Error("Unauthorized");
        return await this.reviewsRepository.deleteReview(params);
    }

    async getReviews(params: GetReviewsParams) {
        return await this.reviewsRepository.getReviews(params);
    }
}