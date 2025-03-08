import { Listing, User } from "@prisma/client";
import { CreateListingParams, FilterListingsParams } from "../interface/Iuser";
import { ListingsRepository } from "../../repositories/user/listingsRepository";

export class ListingsService {
    private listingsRepository: ListingsRepository;

    constructor(listingsRepository: ListingsRepository) {
        this.listingsRepository = listingsRepository;
    }

    async getListingsByCategory(params: FilterListingsParams) {
        return await this.listingsRepository.getListingsByCategory(params);
    }

    async getListingById(listingId: string): Promise<(Listing & { user: User | null }) | null> {
        return await this.listingsRepository.findById(listingId);
    }

    async createListing(params: CreateListingParams): Promise<Listing> {
        if (!params.imageSrc || !Array.isArray(params.imageSrc)) {
            throw new Error("Image sources must be provided as an array");
        }
        return await this.listingsRepository.createListing(params);
    }
}