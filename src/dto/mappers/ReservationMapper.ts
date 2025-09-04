import { Reservation, PaginatedResponse } from "../../services/interface/Iadmin";
import { 
  ReservationResponseDto, 
  ReservationListResponseDto 
} from "../admin/ReservationDto";

export class ReservationMapper {
  static toReservationResponseDto(reservation: Reservation): ReservationResponseDto {
    return {
      id: reservation.id,
      guestName: reservation.guestName,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      hostName: reservation.hostName,
      propertyName: reservation.propertyName
    };
  }

  static toReservationResponseDtoArray(reservations: Reservation[]): ReservationResponseDto[] {
    return reservations.map(reservation => this.toReservationResponseDto(reservation));
  }

  static toReservationListResponseDto(paginatedReservations: PaginatedResponse<Reservation>): ReservationListResponseDto {
    return {
      data: this.toReservationResponseDtoArray(paginatedReservations.data),
      total: paginatedReservations.total,
      currentPage: paginatedReservations.currentPage,
      totalPages: paginatedReservations.totalPages
    };
  }
}
