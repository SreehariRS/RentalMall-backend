
import { IReservationsService, CreateReservationParams, CancelReservationParams } from "../interface/Iuser";
import { IReservationsRepository } from "../../repositories/interface/IUserRepositories";

export class ReservationsService implements IReservationsService {
    private reservationsRepository: IReservationsRepository;

    constructor(reservationsRepository: IReservationsRepository) {
        this.reservationsRepository = reservationsRepository;
    }

    async createReservation(params: CreateReservationParams): Promise<any> {
        return await this.reservationsRepository.createReservation(params);
    }

    async cancelReservation(params: CancelReservationParams, currentUserId: string): Promise<any> {
        const reservation = await this.reservationsRepository.findReservationById(params.reservationId);
        if (!reservation) throw new Error("Reservation not found");
        if (reservation.userId !== currentUserId && reservation.listing.userId !== currentUserId) {
            throw new Error("Unauthorized");
        }
        await this.reservationsRepository.getOrCreateWallet(reservation.userId);
        const updatedWallet = await this.reservationsRepository.refundToWallet({ userId: reservation.userId, amount: reservation.totalPrice });
        await this.reservationsRepository.createCancelledReservation({
            reservationId: reservation.id, userId: reservation.userId, listingId: reservation.listingId,
            startDate: reservation.startDate, endDate: reservation.endDate, totalPrice: reservation.totalPrice,
            cancelledBy: currentUserId, reason: "Cancelled by " + (currentUserId === reservation.userId ? "guest" : "host"),
        });
        await this.reservationsRepository.deleteReservation(params.reservationId);
        if (currentUserId === reservation.listing.userId) {
            await this.reservationsRepository.createNotification({
                userId: reservation.userId,
                message: `Unfortunately, your reservation for "${reservation.listing.title}" has been canceled. The total amount of ₹${reservation.totalPrice} will be refunded to your wallet. We apologize for the inconvenience.`,
            });
        }
        return { success: true, refundedAmount: reservation.totalPrice, newBalance: updatedWallet.balance };
    }
}