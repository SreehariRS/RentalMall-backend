import { Reservation } from "@prisma/client";
import { ReservationDto, CancelReservationResponseDto } from "../../user";

export class ReservationsMapper {
	static toReservationDto(reservation: Reservation): ReservationDto {
		return {
			id: reservation.id,
			userId: reservation.userId,
			listingId: reservation.listingId,
			startDate: reservation.startDate,
			endDate: reservation.endDate,
			totalPrice: reservation.totalPrice,
			status: (reservation as any).status,
		};
	}

	static toCancelReservationResponseDto(success: boolean, refundedAmount: number, newBalance: number): CancelReservationResponseDto {
		return { success, refundedAmount, newBalance };
	}
}
