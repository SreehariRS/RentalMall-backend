import { IOfferService } from "../interface/Iuser";
import { IOfferRepository } from "../../repositories/interface/IUserRepositories";
import { OffersMapper } from "../../dto/mappers/user/OffersMapper";

export class OfferService implements IOfferService {
    private _offerRepository: IOfferRepository;

    constructor(offerRepository: IOfferRepository) {
        this._offerRepository = offerRepository;
    }

    async updateOfferPrice(params: { listingId: string; userId: string; offerPrice: number | null }): Promise<any> {
        if (params.offerPrice !== null && (typeof params.offerPrice !== "number" || params.offerPrice <= 0)) {
            throw new Error("Invalid offer price");
        }
        const result = await this._offerRepository.updateOfferPrice(params);
        if (result.count === 0) throw new Error("Listing not found or unauthorized");
        return OffersMapper.toUpdateOfferPriceResponseDto();
    }
}