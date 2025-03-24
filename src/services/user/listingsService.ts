
import { IListingsService, CreateListingParams, FilterListingsParams } from "../interface/Iuser";
import { IListingsRepository } from "../../repositories/interface/IUserRepositories";

export class ListingsService implements IListingsService {
    private listingsRepository: IListingsRepository;

    constructor(listingsRepository: IListingsRepository) {
        this.listingsRepository = listingsRepository;
    }

    async getListingsByCategory(params: FilterListingsParams): Promise<any> {
        return await this.listingsRepository.getListingsByCategory(params);
    }

    async getListingById(listingId: string): Promise<any> {
        return await this.listingsRepository.findById(listingId);
    }

    async createListing(params: CreateListingParams): Promise<any> {
        if (!params.imageSrc || !Array.isArray(params.imageSrc)) {
            throw new Error("Image sources must be provided as an array");
        }
        return await this.listingsRepository.createListing(params);
    }
}