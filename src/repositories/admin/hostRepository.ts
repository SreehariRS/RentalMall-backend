import prismaInstance from "../../libs/prismadb";
import { PaginatedResponse } from "../../services/interface/Iadmin";

export default class HostRepository {
    async getAllHosts(page = 1, limit = 10): Promise<PaginatedResponse<{ id: string; name: string; listingCount: number; isRestricted: boolean }>> {
        try {
            const skip = (page - 1) * limit;
            const total = await prismaInstance.user.count({ where: { listings: { some: {} } } });
            const hosts = await prismaInstance.user.findMany({
                where: { listings: { some: {} } },
                skip,
                take: limit,
                select: { id: true, name: true, isBlocked: true, listings: { select: { id: true } } },
                orderBy: { createdAt: "desc" },
            });

            const formattedHosts = hosts.map((host) => ({
                id: host.id,
                name: host.name ?? "Unknown",
                listingCount: host.listings.length,
                isRestricted: host.isBlocked,
            }));

            const totalPages = Math.ceil(total / limit);
            return { data: formattedHosts, total, currentPage: page, totalPages };
        } catch (error) {
            console.error("Error in getAllHosts:", error);
            throw error;
        }
    }
}