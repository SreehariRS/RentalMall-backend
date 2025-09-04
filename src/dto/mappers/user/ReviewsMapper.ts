import { Review } from "@prisma/client";
import { ReviewDto } from "../../user";

export class ReviewsMapper {
	static toReviewDto(review: Review): ReviewDto {
		return {
			id: review.id,
			userId: review.userId,
			listingId: review.listingId,
			reservationId: (review as any).reservationId ?? "",
			rating: review.rating as unknown as number,
			title: (review as any).title ?? "",
			content: (review as any).content ?? "",
			createdAt: (review as any).createdAt?.toISOString?.(),
		};
	}
}
