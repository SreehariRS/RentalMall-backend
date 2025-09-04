import { IListingsService, CreateListingParams, FilterListingsParams } from "../interface/Iuser";
import { IListingsRepository } from "../../repositories/interface/IUserRepositories";
import { pusherServer } from "../../libs/pusher";
import { ListingsMapper } from "../../dto/mappers/user/ListingsMapper";

export class ListingsService implements IListingsService {
    private _listingsRepository: IListingsRepository;

    constructor(listingsRepository: IListingsRepository) {
        this._listingsRepository = listingsRepository;
    }

    async getListingsByCategory(params: FilterListingsParams): Promise<any> {
        const listings = await this._listingsRepository.getListingsByCategory(params);
        return ListingsMapper.toListingListResponseDto(listings);
    }

    async getListingById(listingId: string): Promise<any> {
        const listing = await this._listingsRepository.findById(listingId);
        return listing ? ListingsMapper.toListingResponseDto(listing as any) : null;
    }

    async createListing(params: CreateListingParams): Promise<any> {
        if (!params.imageSrc || !Array.isArray(params.imageSrc)) {
            throw new Error("Image sources must be provided as an array");
        }
        const created = await this._listingsRepository.createListing(params);
        return ListingsMapper.toListingResponseDto(created as any);
    }

    async updatePrice(listingId: string, userId: string, price: number): Promise<any> {
        if (typeof price !== "number" || price <= 0) {
            throw { status: 400, message: "Invalid price" };
        }
        const result = await this._listingsRepository.updatePrice(listingId, userId, price);
        if (result.count === 0) {
            throw { status: 404, message: "Listing not found or unauthorized" };
        }
        return { message: "Price updated successfully" };
    }

    async deleteListing(listingId: string, userId: string): Promise<any> {
        const reservations = await this._listingsRepository.findReservationsByListingId(listingId);
        if (reservations.length > 0) {
            for (const reservation of reservations) {
                const notification = await this._listingsRepository.createNotification({
                    userId: reservation.userId,
                    message: `We’re truly sorry to inform you that your reservation for "${reservation.listing.title}" has been canceled as the property is no longer available. We apologize for any inconvenience.`,
                    type: "error",
                    isRead: false,
                });
                if (reservation.user?.email) {
                    await pusherServer.trigger(
                        `user-${reservation.user.email}-notifications`,
                        "notification:new",
                        notification
                    );
                }
            }
        }
        const result = await this._listingsRepository.deleteListing(listingId, userId);
        if (result.count === 0) {
            throw { status: 404, message: "Listing not found or unauthorized" };
        }
        return result;
    }

    async updateListing(listingId: string, userId: string, data: any): Promise<any> {
        const { category, imageSrc, title, description, price } = data;
        if (!category || typeof category !== "string") {
            throw { status: 400, message: "Invalid or missing category" };
        }
        if (
            !imageSrc ||
            !Array.isArray(imageSrc) ||
            imageSrc.length !== 5 ||
            !imageSrc.every((url: any) => typeof url === "string")
        ) {
            throw { status: 400, message: "Exactly 5 valid image URLs are required" };
        }
        if (!title || typeof title !== "string" || !description || typeof description !== "string") {
            throw { status: 400, message: "Title and description are required" };
        }
        const priceNum = typeof price === "string" ? parseInt(price, 10) : price;
        if (isNaN(priceNum) || priceNum <= 0) {
            throw { status: 400, message: "Price must be a positive number" };
        }
        const result = await this._listingsRepository.updateListing(listingId, userId, {
            category,
            imageSrc,
            title,
            description,
            price: priceNum,
        });
        if (result.count === 0) {
            throw { status: 404, message: "Listing not found or unauthorized" };
        }
        return { message: "Listing updated successfully" };
    }
}