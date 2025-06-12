import prismaInstance from "../../libs/prismadb";
import { PaginatedResponse, Reservation } from "../../services/interface/Iadmin";
import { IReservationRepository } from "../interface/IadminRepositories";

export default class ReservationRepository implements IReservationRepository {
    async getAllReservations(page: number = 1, limit: number = 8): Promise<PaginatedResponse<Reservation>> {
        try {
            const skip = (page - 1) * limit;

            // Get total count of valid reservations (with existing listings)
            const total = await prismaInstance.reservation.count({
                where: {
                    listing: {
                        id: { not: undefined }, // Ensure listing exists
                    },
                },
            });

            // Fetch reservations with related user and listing data
            const reservations = await prismaInstance.reservation.findMany({
                skip,
                take: limit,
                where: {
                    listing: {
                        id: { not: undefined }, // Ensure listing exists
                    },
                },
                include: {
                    user: {
                        select: { name: true },
                    },
                    listing: {
                        select: {
                            title: true,
                            user: { select: { name: true } },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });

            // Format reservations to match the Reservation interface
            const formattedReservations: Reservation[] = reservations.map((reservation) => ({
                id: reservation.id,
                guestName: reservation.user?.name ?? "Unknown Guest",
                startDate: reservation.startDate.toISOString(),
                endDate: reservation.endDate.toISOString(),
                hostName: reservation.listing?.user?.name ?? "Unknown Host",
                propertyName: reservation.listing?.title ?? "Unknown Property",
            }));

            const totalPages = Math.ceil(total / limit);
            return { data: formattedReservations, total, currentPage: page, totalPages };
        } catch (error) {
            console.error("Error in getAllReservations:", error);
            throw error;
        }
    }
}