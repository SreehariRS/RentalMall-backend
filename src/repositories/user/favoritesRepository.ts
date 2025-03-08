import { User } from "@prisma/client";
import prisma from "../../libs/prismadb";

export class FavoritesRepository {
    async addFavorite(userId: string, listingId: string): Promise<User> {
        return await prisma.user.update({
            where: { id: userId },
            data: { favoriteIds: { push: listingId } },
        });
    }

    async removeFavorite(userId: string, listingId: string): Promise<User> {
        return await prisma.user.update({
            where: { id: userId },
            data: {
                favoriteIds: {
                    set: (await prisma.user.findUnique({ where: { id: userId } }))?.favoriteIds.filter((id) => id !== listingId),
                },
            },
        });
    }
}