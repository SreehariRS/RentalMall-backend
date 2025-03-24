import { Request, Response } from "express";
import { IListingsService } from "../../services/interface/Iuser";
import { IListingsController } from "../interface/IuserController";

export class ListingsController implements IListingsController {
    private listingsService: IListingsService;

    constructor(listingsService: IListingsService) {
        this.listingsService = listingsService;
    }

    async getListingsByCategory(req: Request, res: Response): Promise<Response> {
        try {
            const { category } = req.query;
            const listings = await this.listingsService.getListingsByCategory({ category: category as string });
            return res.status(200).json(listings);
        } catch (error) {
            console.error("Error fetching listings by category:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async getListingById(req: Request, res: Response): Promise<Response> {
        const { listingId } = req.params;
        if (!listingId) {
            return res.status(400).json({ error: "Listing ID is required." });
        }
        try {
            const listing = await this.listingsService.getListingById(listingId);
            if (!listing) {
                return res.status(404).json({ error: "Listing not found." });
            }
            return res.status(200).json(listing);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async createListing(req: Request, res: Response): Promise<Response> {
        try {
            const { title, description, imageSrc, category, roomCount, guestCount, location, price } = req.body;
            const userId = (req as any).user.id;
            const listing = await this.listingsService.createListing({
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
            return res.status(201).json(listing);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}
