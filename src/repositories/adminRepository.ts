import prismaInstance from "../libs/prismadb";
import AdminRepository from "./interface/IadminRepository";

interface Admin {
    id: string;
    email: string;
    password: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    isBlocked: boolean;
    image: string | null;
}

interface Reservation {
    id: string;
    guestName: string;
    startDate: string;
    endDate: string;
    hostName: string;
    propertyName: string;
}

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    currentPage: number;
    totalPages: number;
}

export class AdminRepositoryImplementation implements AdminRepository {
    async findByEmail(email: string): Promise<Admin | null> {
        const admin = await prismaInstance.admin.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
            },
        });
        if (!admin) return null;

        return {
            id: admin.id,
            email: admin.email,
            password: admin.password,
        };
    }

    async getAllUsers(page: number = 1, limit: number = 8): Promise<PaginatedResponse<User>> {
        try {
            const skip = (page - 1) * limit;
            const total = await prismaInstance.user.count();
            const users = await prismaInstance.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    isBlocked: true,
                    image: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            const formattedUsers = users.map((user) => ({
                id: user.id,
                name: user.name ?? "Unknown",
                email: user.email ?? "No email provided",
                isBlocked: user.isBlocked,
                image: user.image,
            }));

            const totalPages = Math.ceil(total / limit);

            return {
                data: formattedUsers,
                total,
                currentPage: page,
                totalPages,
            };
        } catch (error) {
            console.error("Error in getAllUsers:", error);
            throw error;
        }
    }

    async getAllReservations(page: number = 1, limit: number = 8): Promise<PaginatedResponse<Reservation>> {
        try {
            const skip = (page - 1) * limit;
            const total = await prismaInstance.reservation.count();

            const reservations = await prismaInstance.reservation.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    startDate: true,
                    endDate: true,
                    user: {
                        // guest (user who made the reservation)
                        select: {
                            name: true,
                        },
                    },
                    listing: {
                        // property
                        select: {
                            title: true,
                            user: {
                                // host (owner of the listing)
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            const formattedReservations = reservations.map((reservation) => ({
                id: reservation.id,
                guestName: reservation.user?.name ?? "Unknown Guest",
                startDate: reservation.startDate.toISOString(),
                endDate: reservation.endDate.toISOString(),
                hostName: reservation.listing?.user?.name ?? "Unknown Host",
                propertyName: reservation.listing?.title ?? "Unknown Property",
            }));

            const totalPages = Math.ceil(total / limit);

            // Returning the formatted reservations with the key `data`
            return {
                data: formattedReservations, // Adjusted to match expected output format
                total,
                currentPage: page,
                totalPages,
            };
        } catch (error) {
            console.error("Error in getAllReservations:", error);
            throw error;
        }
    }

    async blockUser(userId: string): Promise<User | null> {
        const user = await prismaInstance.user.update({
            where: { id: userId },
            data: { isBlocked: true },
            select: {
                id: true,
                name: true,
                email: true,
                isBlocked: true,
                image: true,
            },
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
            select: {
                id: true,
                name: true,
                email: true,
                isBlocked: true,
                image: true,
            },
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
    async getAllHosts(
        page = 1,
        limit = 10
    ): Promise<PaginatedResponse<{ id: string; name: string; listingCount: number; isRestricted: boolean }>> {
        try {
            const skip = (page - 1) * limit;
            const total = await prismaInstance.user.count({ where: { listings: { some: {} } } });
            const hosts = await prismaInstance.user.findMany({
                where: { listings: { some: {} } },
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    isBlocked: true,
                    listings: { select: { id: true } },
                },
                orderBy: { createdAt: "desc" },
            });

            const formattedHosts = hosts.map((host) => ({
                id: host.id,
                name: host.name ?? "Unknown",
                listingCount: host.listings.length,
                isRestricted: host.isBlocked,
            }));

            const totalPages = Math.ceil(total / limit);

            return {
                data: formattedHosts,
                total,
                currentPage: page,
                totalPages,
            };
        } catch (error) {
            console.error("Error in getAllHosts:", error);
            throw error;
        }
    }

    //dashboard
    async getDashboardStats() {
        // Current month's data
        const totalUsers = await prismaInstance.user.count();
        const totalBookings = await prismaInstance.reservation.count();
        const totalListings = await prismaInstance.listing.count();
        const totalHosts = await prismaInstance.user.count({
            where: {
                listings: {
                    some: {},
                },
            },
        });

        // Previous month's data for growth calculation
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const previousUsers = await prismaInstance.user.count({
            where: { createdAt: { lt: oneMonthAgo } },
        });
        const previousBookings = await prismaInstance.reservation.count({
            where: { createdAt: { lt: oneMonthAgo } },
        });
        const previousListings = await prismaInstance.listing.count({
            where: { createdAt: { lt: oneMonthAgo } },
        });
        const previousHosts = await prismaInstance.user.count({
            where: {
                createdAt: { lt: oneMonthAgo },
                listings: { some: {} },
            },
        });

        // Calculate growth percentages
        const usersGrowth = previousUsers > 0 ? Math.round(((totalUsers - previousUsers) / previousUsers) * 100) : 0;
        const bookingsGrowth =
            previousBookings > 0 ? Math.round(((totalBookings - previousBookings) / previousBookings) * 100) : 0;
        const listingsGrowth =
            previousListings > 0 ? Math.round(((totalListings - previousListings) / previousListings) * 100) : 0;
        const hostsGrowth = previousHosts > 0 ? Math.round(((totalHosts - previousHosts) / previousHosts) * 100) : 0;

        // Monthly bookings with full year representation
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const monthlyBookings = await prismaInstance.reservation.groupBy({
            by: ["startDate"],
            _count: { id: true },
            orderBy: { startDate: "asc" },
        });

        const bookingsMap = new Map(
            monthlyBookings.map((booking) => [
                new Date(booking.startDate).toLocaleString("default", { month: "short" }),
                booking._count.id || 0,
            ])
        );

        const fullYearBookings = months.map((month) => ({
            month,
            bookings: bookingsMap.get(month) || 0,
        }));
        // Group reservations by category
        const bookingsByCategory = await prismaInstance.reservation.groupBy({
            by: ["listingId"],
            _count: { id: true },
        });

        // Fetch listing categories for each reservation
        const listingCategories = await prismaInstance.listing.findMany({
            where: { id: { in: bookingsByCategory.map((b) => b.listingId) } },
            select: { id: true, category: true },
        });

        // Merge reservation count with listing categories
        const formattedBookingsByCategory = listingCategories.map((listing) => ({
            name: listing.category,
            value: bookingsByCategory.find((b) => b.listingId === listing.id)?._count.id || 0,
        }));

        return {
            totalUsers,
            totalBookings,
            totalListings,
            totalHosts,
            usersGrowth,
            bookingsGrowth,
            listingsGrowth,
            hostsGrowth,
            monthlyBookings: fullYearBookings,
            bookingsByCategory: formattedBookingsByCategory,
            listingsByCategory: formattedBookingsByCategory,
        };
    }
}

export { AdminRepository };
