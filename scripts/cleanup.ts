import prisma from "../src/libs/prismadb";

async function cleanupInvalidReservations() {
    try {
        // Find all reservation listingIds
        const allReservations = await prisma.reservation.findMany({
            select: {
                id: true,
                listingId: true,
            },
        });

        // Find all valid listingIds
        const validListingIds = await prisma.listing.findMany({
            select: {
                id: true,
            },
        }).then(listings => listings.map(listing => listing.id));

        // Identify invalid reservations
        const invalidReservations = allReservations.filter(
            reservation => !validListingIds.includes(reservation.listingId)
        );
        console.log("Invalid Reservations Found:", invalidReservations);

        // Delete invalid reservations
        const invalidReservationIds = invalidReservations.map(res => res.id);
        if (invalidReservationIds.length > 0) {
            const deleted = await prisma.reservation.deleteMany({
                where: {
                    id: { in: invalidReservationIds },
                },
            });
            console.log(`Deleted ${deleted.count} invalid reservations.`);
        } else {
            console.log("No invalid reservations to delete.");
        }
    } catch (error) {
        console.error("Error cleaning up reservations:", error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupInvalidReservations();