import { UpdateOfferPriceResponseDto } from "../../user";

export class OffersMapper {
	static toUpdateOfferPriceResponseDto(): UpdateOfferPriceResponseDto {
		return { message: "Offer price updated successfully" };
	}
}
