
import prismaInstance from "../../libs/prismadb";
import { PaginatedResponse, Reservation } from "../../services/interface/Iadmin";
import { IReservationRepository } from "../interface/IadminRepositories";

export default class ReservationRepository implements IReservationRepository {
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
                    user: { select: { name: true } },
                    listing: { select: { title: true, user: { select: { name: true } } } },
                },
                orderBy: { createdAt: "desc" },
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
            return { data: formattedReservations, total, currentPage: page, totalPages };
        } catch (error) {
            console.error("Error in getAllReservations:", error);
            throw error;
        }
    }
}