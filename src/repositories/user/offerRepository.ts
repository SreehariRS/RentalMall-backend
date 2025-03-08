import prisma from "../../libs/prismadb";
import { UpdateOfferPriceParams } from "../../services/interface/Iuser";

export class OfferRepository {
    async updateOfferPrice(params: UpdateOfferPriceParams): Promise<any> {
        return await prisma.listing.updateMany({ where: { id: params.listingId, userId: params.userId }, data: { offerPrice: params.offerPrice } });
    }
}