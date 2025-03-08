import { Listing, User } from "@prisma/client";
import prisma from "../../libs/prismadb";
import { CreateListingParams, FilterListingsParams } from "../../services/interface/Iuser";

export class ListingsRepository {
    async getListingsByCategory(params: FilterListingsParams): Promise<any> {
        return await prisma.listing.findMany({ where: { category: params.category } });
    }

    async findById(id: string): Promise<(Listing & { user: User | null }) | null> {
        const listing = await prisma.listing.findUnique({ where: { id }, include: { user: true } });
        if (!listing) return null;
        return { ...listing, createdAt: listing.createdAt, user: listing.user ? { ...listing.user, createdAt: listing.user.createdAt, updatedAt: listing.user.updatedAt, emailVerified: listing.user.emailVerified } : null };
    }

    async createListing(data: CreateListingParams): Promise<Listing> {
        return await prisma.listing.create({
            data: {
                title: data.title, description: data.description, imageSrc: data.imageSrc, category: data.category,
                roomCount: data.roomCount, guestCount: data.guestCount, locationValues: data.locationValues, price: data.price, userId: data.userId,
            },
        });
    }
}