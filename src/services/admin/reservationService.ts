import ReservationRepository from "../../repositories/admin/reservationRepository";
import { PaginatedResponse, Reservation } from "../interface/Iadmin";

export default class ReservationService {
    private reservationRepository: ReservationRepository;

    constructor(reservationRepository: ReservationRepository) {
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