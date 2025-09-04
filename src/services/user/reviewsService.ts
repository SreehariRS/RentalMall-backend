import {
    IReviewsService,
    CreateReviewParams,
    UpdateReviewParams,
    DeleteReviewParams,
    GetReviewsParams,
} from "../interface/Iuser";
import { IReviewsRepository } from "../../repositories/interface/IUserRepositories";
import { ReviewsMapper } from "../../dto/mappers/user/ReviewsMapper";

export class ReviewsService implements IReviewsService {
    private _reviewsRepository: IReviewsRepository;

    constructor(reviewsRepository: IReviewsRepository) {
        this._reviewsRepository = reviewsRepository;
    }

    async createReviewOrResponse(userId: string, params: any): Promise<any> {
        const { listingId, reservationId, rating, title, content, responseToReviewId } = params;
        if (responseToReviewId) {
            const listing = await this._reviewsRepository.findListingById(listingId);
            if (!listing || listing.userId !== userId) {
                throw { status: 403, message: "You can only respond to reviews on your own listings" };
            }
            return await this._reviewsRepository.createReviewResponse({
                reviewId: responseToReviewId,
                userId,
                content,
            });
        }
        if (!listingId || !reservationId || !rating || !title || !content) {
            throw { status: 400, message: "Missing required fields" };
        }
        const existingReview = await this._reviewsRepository.findReviewByReservation(userId, reservationId);
        if (existingReview) {
            throw { status: 409, message: "You have already reviewed this reservation" };
        }
        const review = await this._reviewsRepository.createReview({
            userId,
            listingId,
            reservationId,
            rating,
            title,
            content,
        });
        return ReviewsMapper.toReviewDto(review);
    }

    async createReview(params: CreateReviewParams): Promise<any> {
        const existingReview = await this._reviewsRepository.findReviewById(params.reservationId);
        if (existingReview) throw new Error("You have already reviewed this reservation");
        const review = await this._reviewsRepository.createReview(params);
        return ReviewsMapper.toReviewDto(review);
    }

    async updateReview(params: UpdateReviewParams, currentUserId: string): Promise<any> {
        const review = await this._reviewsRepository.findReviewById(params.reviewId);
        if (!review) throw new Error("Review not found");
        if (review.userId !== currentUserId) throw new Error("Unauthorized");
        const updated = await this._reviewsRepository.updateReview(params);
        return ReviewsMapper.toReviewDto(updated);
    }

    async deleteReview(params: DeleteReviewParams, currentUserId: string): Promise<any> {
        const review = await this._reviewsRepository.findReviewById(params.reviewId);
        if (!review) throw new Error("Review not found");
        if (review.userId !== currentUserId) throw new Error("Unauthorized");
        return await this._reviewsRepository.deleteReview(params);
    }

    async getReviews(params: GetReviewsParams): Promise<any> {
        const result = await this._reviewsRepository.getReviews(params);
        return result;
    }
}