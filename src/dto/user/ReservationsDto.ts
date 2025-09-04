export interface ReservationDto {
	id: string;
	userId: string;
	listingId: string;
	startDate: string | Date;
	endDate: string | Date;
	totalPrice: number;
	status?: string;
}

export interface CreateReservationRequestDto {
	userId: string;
	listingId: string;
	startDate: Date;
	endDate: Date;
	locationValues: string;
	totalPrice: number;
	orderId: string;
	paymentId?: string;
	status: string;
}

export interface CancelReservationRequestDto {
	reservationId: string;
	userId: string;
}

export interface CancelReservationResponseDto {
	success: boolean;
	refundedAmount: number;
	newBalance: number;
}
