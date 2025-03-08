import prismaInstance from "../../libs/prismadb";
import { PaginatedResponse, User } from "../../services/interface/Iadmin";

export default class UserRepository {
    async getAllUsers(page: number = 1, limit: number = 8): Promise<PaginatedResponse<User>> {
        try {
            const skip = (page - 1) * limit;
            const total = await prismaInstance.user.count();
            const users = await prismaInstance.user.findMany({
                skip,
                take: limit,
                select: { id: true, name: true, email: true, isBlocked: true, image: true },
                orderBy: { createdAt: "desc" },
            });

            const formattedUsers = users.map((user) => ({
                id: user.id,
                name: user.name ?? "Unknown",
                email: user.email ?? "No email provided",
                isBlocked: user.isBlocked,
                image: user.image,
            }));

            const totalPages = Math.ceil(total / limit);
            return { data: formattedUsers, total, currentPage: page, totalPages };
        } catch (error) {
            console.error("Error in getAllUsers:", error);
            throw error;
        }
    }

    async blockUser(userId: string): Promise<User | null> {
        const user = await prismaInstance.user.update({
            where: { id: userId },
            data: { isBlocked: true },
            select: { id: true, name: true, email: true, isBlocked: true, image: true },
        });
        if (!user) return null;
        return {
            id: user.id,
            name: user.name ?? "Unknown",
            email: user.email ?? "No email provided",
            isBlocked: user.isBlocked,
            image: user.image,
        };
    }

    async unblockUser(userId: string): Promise<User | null> {
        const user = await prismaInstance.user.update({
            where: { id: userId },
            data: { isBlocked: false },
            select: { id: true, name: true, email: true, isBlocked: true, image: true },
        });
        if (!user) return null;
        return {
            id: user.id,
            name: user.name ?? "Unknown",
            email: user.email ?? "No email provided",
            isBlocked: user.isBlocked,
            image: user.image,
        };
    }
}