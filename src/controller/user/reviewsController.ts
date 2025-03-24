import { Request, Response } from "express";
import { IReviewsService } from "../../services/interface/Iuser";
import { IReviewsController } from "../interface/IuserController";

export class ReviewsController implements IReviewsController {
    private reviewsService: IReviewsService;

    constructor(reviewsService: IReviewsService) {
        this.reviewsService = reviewsService;
    }

    async createReview(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) return res.status(401).json({ message: "Unauthorized" });
            const result = await this.reviewsService.createReview({ ...req.body, userId: currentUser.id });
            return res.status(200).json(result);
        } catch (error) {
            console.error("CREATE_REVIEW_ERROR", error);
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            return res.status(500).json({ message: errorMessage });
        }
    }

    async updateReview(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) return res.status(401).json({ message: "Unauthorized" });
            const result = await this.reviewsService.updateReview(req.body, currentUser.id);
            return res.status(200).json(result);
        } catch (error) {
            console.error("UPDATE_REVIEW_ERROR", error);
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            return res.status(500).json({ message: errorMessage });
        }
    }

    async deleteReview(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) return res.status(401).json({ message: "Unauthorized" });
            await this.reviewsService.deleteReview({ reviewId: req.params.reviewId, userId: currentUser.id }, currentUser.id);
            return res.status(200).json({ message: "Review deleted successfully" });
        } catch (error) {
            console.error("DELETE_REVIEW_ERROR", error);
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            return res.status(500).json({ message: errorMessage });
        }
    }

    async getReviews(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.reviewsService.getReviews({ listingId: req.params.listingId });
            return res.status(200).json(result);
        } catch (error) {
            console.error("GET_REVIEWS_ERROR", error);
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            return res.status(500).json({ message: errorMessage });
        }
    }
}