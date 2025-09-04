import { Request, Response } from "express";
import { IListingsService } from "../../services/interface/Iuser";
import { IListingsController } from "../interface/IuserController";
import { HttpStatusCodes } from "../../config/HttpStatusCodes";
import { Messages } from "../../config/message";

export class ListingsController implements IListingsController {
    private _listingsService: IListingsService;

    constructor(listingsService: IListingsService) {
        this._listingsService = listingsService;
    }

    async getListingsByCategory(req: Request, res: Response): Promise<Response> {
        try {
            const { category } = req.query;
            const listings = await this._listingsService.getListingsByCategory({ category: category as string });
            return res.status(HttpStatusCodes.OK).json(listings);
        } catch (error) {
            console.error("Error fetching listings by category:", error);
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR });
        }
    }

    async getListingById(req: Request, res: Response): Promise<Response> {
        const { listingId } = req.params;
        if (!listingId) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: Messages.LISTING_ID_REQUIRED });
        }
        try {
            const listing = await this._listingsService.getListingById(listingId);
            if (!listing) {
                return res.status(HttpStatusCodes.NOT_FOUND).json({ error: Messages.LISTING_NOT_FOUND });
            }
            return res.status(HttpStatusCodes.OK).json(listing);
        } catch (error: any) {
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    async createListing(req: Request, res: Response): Promise<Response> {
        try {
            const { title, description, imageSrc, category, roomCount, guestCount, location, price } = req.body;
            const userId = (req as any).user.id;
            const listing = await this._listingsService.createListing({
                title,
                description,
                imageSrc,
                category,
                roomCount,
                guestCount,
                location,
                price,
                userId,
                locationValues: undefined,
            });
            return res.status(HttpStatusCodes.CREATED).json(listing);
        } catch (error: any) {
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    async updatePrice(req: Request, res: Response): Promise<Response> {
        const currentUser = (req as any).user;
        if (!currentUser) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED });
        }
        const { listingId } = req.params;
        const { price } = req.body;
        if (!listingId || typeof listingId !== "string") {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: Messages.INVALID_ID });
        }
        try {
            const result = await this._listingsService.updatePrice(listingId, currentUser.id, price);
            return res.status(HttpStatusCodes.OK).json(result);
        } catch (error: any) {
            return res.status(error.status || HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    async deleteListing(req: Request, res: Response): Promise<Response> {
        const currentUser = (req as any).user;
        if (!currentUser) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED });
        }
        const { listingId } = req.params;
        if (!listingId || typeof listingId !== "string") {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: Messages.INVALID_ID });
        }
        try {
            const result = await this._listingsService.deleteListing(listingId, currentUser.id);
            return res.status(HttpStatusCodes.OK).json(result);
        } catch (error: any) {
            return res.status(error.status || HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    async updateListing(req: Request, res: Response): Promise<Response> {
        const currentUser = (req as any).user;
        if (!currentUser) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED });
        }
        const { listingId } = req.params;
        const { category, imageSrc, title, description, price } = req.body;
        if (!listingId || typeof listingId !== "string") {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: Messages.INVALID_LISTING_ID });
        }
        try {
            const result = await this._listingsService.updateListing(listingId, currentUser.id, {
                category,
                imageSrc,
                title,
                description,
                price,
            });
            return res.status(HttpStatusCodes.OK).json(result);
        } catch (error: any) {
            console.error("Error in updateListing:", error);
            return res.status(error.status || HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}