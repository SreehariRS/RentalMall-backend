
import prisma from "../../libs/prismadb";
import { UpdateOfferPriceParams } from "../../services/interface/Iuser";
import { IOfferRepository } from "../interface/IUserRepositories";

export class OfferRepository implements IOfferRepository {
    async updateOfferPrice(params: UpdateOfferPriceParams): Promise<{ count: number }> {
        return await prisma.listing.updateMany({ where: { id: params.listingId, userId: params.userId }, data: { offerPrice: params.offerPrice } });
    }
}