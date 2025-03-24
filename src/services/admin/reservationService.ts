
import { IReservationRepository } from "../../repositories/interface/IadminRepositories";
import { IReservationService, PaginatedResponse, Reservation } from "../interface/Iadmin";

export default class ReservationService implements IReservationService {
    private reservationRepository: IReservationRepository;

    constructor(reservationRepository: IReservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    async getAllReservations(page: number, limit: number): Promise<PaginatedResponse<Reservation>> {
        const response = await this.reservationRepository.getAllReservations(page, limit);
        return {
            data: response.data,
            total: response.total,
            currentPage: page,
            totalPages: response.totalPages,
        };
    }
}