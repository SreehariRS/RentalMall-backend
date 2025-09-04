import { IReservationRepository } from "../../repositories/interface/IadminRepositories";
import { IReservationService, Reservation, PaginatedResponse } from "../interface/Iadmin";
import { ReservationMapper } from "../../dto/mappers";

export default class ReservationService implements IReservationService {
  private _reservationRepository: IReservationRepository;

  constructor(reservationRepository: IReservationRepository) {
    this._reservationRepository = reservationRepository;
  }

  async getAllReservations(page: number, limit: number): Promise<import("../../dto/admin").ReservationListResponseDto> {
    const paginatedReservations = await this._reservationRepository.getAllReservations(page, limit);
    // Use DTO mapper to return properly formatted response
    return ReservationMapper.toReservationListResponseDto(paginatedReservations);
  }
}