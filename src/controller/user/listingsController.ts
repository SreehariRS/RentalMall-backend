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
    async updatePrice(req: Request, res: Response): Promise<Response> {
        const currentUser = (req as any).user;
        if (!currentUser) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        const { listingId } = req.params;
        const { price } = req.body;
        if (!listingId || typeof listingId !== "string") {
          return res.status(400).json({ error: "Invalid ID" });
        }
        try {
          const result = await this.listingsService.updatePrice(listingId, currentUser.id, price);
          return res.status(200).json(result);
        } catch (error: any) {
          return res.status(error.status || 500).json({ error: error.message });
        }
      }
    
      async deleteListing(req: Request, res: Response): Promise<Response> {
        const currentUser = (req as any).user;
        if (!currentUser) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        const { listingId } = req.params;
        if (!listingId || typeof listingId !== "string") {
          return res.status(400).json({ error: "Invalid ID" });
        }
        try {
          const result = await this.listingsService.deleteListing(listingId, currentUser.id);
          return res.status(200).json(result);
        } catch (error: any) {
          return res.status(error.status || 500).json({ error: error.message });
        }
      }
    
      async updateListing(req: Request, res: Response): Promise<Response> {
        const currentUser = (req as any).user;
        if (!currentUser) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        const { listingId } = req.params;
        const { category, imageSrc, title, description, price } = req.body;
        if (!listingId || typeof listingId !== "string") {
          return res.status(400).json({ error: "Invalid listing ID" });
        }
        try {
          const result = await this.listingsService.updateListing(listingId, currentUser.id, {
            category,
            imageSrc,
            title,
            description,
            price,
          });
          return res.status(200).json(result);
        } catch (error: any) {
          console.error("Error in updateListing:", error);
          return res.status(error.status || 500).json({ error: error.message });
        }
      }
}
