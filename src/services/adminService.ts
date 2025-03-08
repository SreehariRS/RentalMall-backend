import AdminRepository from "../repositories/interface/IadminRepository";
import { Admin, User, Reservation, PaginatedResponse } from "../services/interface/Iadmin";

class AdminService {
    private adminRepository: AdminRepository;

    constructor(adminRepository: AdminRepository) {
        this.adminRepository = adminRepository;
    }

    async findByEmail(email: string): Promise<Admin | null> {
        const admin = await this.adminRepository.findByEmail(email);
        return admin;
    }

    async getAllUsers(page: number, limit: number): Promise<PaginatedResponse<User>> {
        return await this.adminRepository.getAllUsers(page, limit);
    }

    async blockUser(userId: string): Promise<User | null> {
        const user = await this.adminRepository.blockUser(userId);
        return user;
    }

    async unblockUser(userId: string): Promise<User | null> {
        const user = await this.adminRepository.unblockUser(userId);
        return user;
    }
async getAllHosts(page: number, limit: number): Promise<PaginatedResponse<{ id: string; name: string; listingCount: number; isRestricted: boolean }>> {
    return await this.adminRepository.getAllHosts(page, limit);
  }

    async getAllReservations(page: number, limit: number): Promise<PaginatedResponse<Reservation>> {
        const response = await this.adminRepository.getAllReservations(page, limit);

        return {
            data: response.data,
            total: response.total,
            currentPage: page,
            totalPages: response.totalPages,
        };
    }

    //dashboard
    async getDashboardStats() {
        return await this.adminRepository.getDashboardStats();
    }
}

export default AdminService;
