
import prisma from "../../libs/prismadb";
import { IOfferRepository } from "../interface/IUserRepositories";

export class OfferRepository implements IOfferRepository {
    async updateOfferPrice(params: { listingId: string; userId: string; offerPrice: number | null }): Promise<{ count: number }> {
        return await prisma.listing.updateMany({ where: { id: params.listingId, userId: params.userId }, data: { offerPrice: params.offerPrice } });
    }
}