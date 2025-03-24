
import { IOfferService, UpdateOfferPriceParams } from "../interface/Iuser";
import { IOfferRepository } from "../../repositories/interface/IUserRepositories";

export class OfferService implements IOfferService {
    private offerRepository: IOfferRepository;

    constructor(offerRepository: IOfferRepository) {
        this.offerRepository = offerRepository;
    }

    async updateOfferPrice(params: UpdateOfferPriceParams): Promise<any> {
        if (params.offerPrice !== null && (typeof params.offerPrice !== "number" || params.offerPrice <= 0)) {
            throw new Error("Invalid offer price");
        }
        const result = await this.offerRepository.updateOfferPrice(params);
        if (result.count === 0) throw new Error("Listing not found or unauthorized");
        return { message: "Offer price updated successfully" };
    }
}