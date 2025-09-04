import { Listing } from "@prisma/client";
import { ListingDto, ListingListResponseDto, ListingResponseDto } from "../../user";

export class ListingsMapper {
	static toListingDto(listing: Listing & { user?: any }): ListingDto {
		return {
			id: listing.id,
			title: listing.title,
			description: listing.description,
			imageSrc: (listing as any).imageSrc ?? [],
			category: listing.category,
			roomCount: (listing as any).roomCount ?? 0,
			guestCount: (listing as any).guestCount ?? 0,
			location: (listing as any).location ?? { value: (listing as any).locationValue },
			price: Number(listing.price),
			userId: listing.userId,
		};
	}

	static toListingListResponseDto(listings: (Listing & { user?: any })[]): ListingListResponseDto {
		return { listings: listings.map(this.toListingDto) };
	}

	static toListingResponseDto(listing: Listing & { user?: any }): ListingResponseDto {
		return this.toListingDto(listing);
	}
}
