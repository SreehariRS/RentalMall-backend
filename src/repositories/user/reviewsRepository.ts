import prisma from "../../libs/prismadb";
import { CreateReviewParams, UpdateReviewParams, DeleteReviewParams, GetReviewsParams } from "../../services/interface/Iuser";

export class ReviewsRepository {
    async createReview(params: CreateReviewParams): Promise<any> {
        return await prisma.review.create({
            data: { userId: params.userId, listingId: params.listingId, reservationId: params.reservationId, rating: params.rating, title: params.title, content: params.content, verified: true },
        });
    }

    async updateReview(params: UpdateReviewParams): Promise<any> {
        return await prisma.review.update({ where: { id: params.reviewId }, data: { rating: params.rating, title: params.title, content: params.content } });
    }

    async deleteReview(params: DeleteReviewParams): Promise<any> {
        return await prisma.review.delete({ where: { id: params.reviewId, userId: params.userId } });
    }

    async getReviews(params: GetReviewsParams): Promise<any> {
        const reviews = await prisma.review.findMany({ where: { listingId: params.listingId }, include: { user: true }, orderBy: { createdAt: "desc" } });
        return reviews.map((review) => ({
            id: review.id, author: review.user.name || "Anonymous", date: review.createdAt.toISOString(), rating: review.rating,
            title: review.title, content: review.content, helpfulCount: review.helpfulCount, verified: review.verified, userId: review.userId,
        }));
    }

    async findReviewById(reviewId: string): Promise<any> {
        return await prisma.review.findUnique({ where: { id: reviewId } });
    }
}