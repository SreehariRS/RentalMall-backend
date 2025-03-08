import prismaInstance from "../../libs/prismadb";

export default class DashboardRepository {
    async getDashboardStats() {
        const totalUsers = await prismaInstance.user.count();
        const totalBookings = await prismaInstance.reservation.count();
        const totalListings = await prismaInstance.listing.count();
        const totalHosts = await prismaInstance.user.count({ where: { listings: { some: {} } } });

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const previousUsers = await prismaInstance.user.count({ where: { createdAt: { lt: oneMonthAgo } } });
        const previousBookings = await prismaInstance.reservation.count({ where: { createdAt: { lt: oneMonthAgo } } });
        const previousListings = await prismaInstance.listing.count({ where: { createdAt: { lt: oneMonthAgo } } });
        const previousHosts = await prismaInstance.user.count({
            where: { createdAt: { lt: oneMonthAgo }, listings: { some: {} } },
        });

        const usersGrowth = previousUsers > 0 ? Math.round(((totalUsers - previousUsers) / previousUsers) * 100) : 0;
        const bookingsGrowth = previousBookings > 0 ? Math.round(((totalBookings - previousBookings) / previousBookings) * 100) : 0;
        const listingsGrowth = previousListings > 0 ? Math.round(((totalListings - previousListings) / previousListings) * 100) : 0;
        const hostsGrowth = previousHosts > 0 ? Math.round(((totalHosts - previousHosts) / previousHosts) * 100) : 0;

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

        const bookingsByCategory = await prismaInstance.reservation.groupBy({
            by: ["listingId"],
            _count: { id: true },
        });

        const listingCategories = await prismaInstance.listing.findMany({
            where: { id: { in: bookingsByCategory.map((b) => b.listingId) } },
            select: { id: true, category: true },
        });

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