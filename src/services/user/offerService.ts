import { UpdateOfferPriceParams } from "../interface/Iuser";
import { OfferRepository } from "../../repositories/user/offerRepository";

export class OfferService {
    private offerRepository: OfferRepository;

    constructor(offerRepository: OfferRepository) {
        this.offerRepository = offerRepository;
    }

    async updateOfferPrice(params: UpdateOfferPriceParams) {
        if (params.offerPrice !== null && (typeof params.offerPrice !== "number" || params.offerPrice <= 0)) {
            throw new Error("Invalid offer price");
        }
        const listing = await this.offerRepository.updateOfferPrice(params);
        if (listing.count === 0) throw new Error("Listing not found or unauthorized");
        return { message: "Offer price updated successfully" };
    }
}