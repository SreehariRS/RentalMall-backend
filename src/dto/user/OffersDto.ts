export interface UpdateOfferPriceRequestDto {
	listingId: string;
	userId: string;
	offerPrice: number | null;
}

export interface UpdateOfferPriceResponseDto {
	message: string;
}
