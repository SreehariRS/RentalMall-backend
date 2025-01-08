// In services/adminService.ts

import AdminRepository from "../repositories/interface/IadminRepository";

interface Admin {
  id: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

interface PaginatedResponse {
  users: User[];
  total: number;
  currentPage: number;
  totalPages: number;
}

class AdminService {
  private adminRepository: AdminRepository;

  constructor(adminRepository: AdminRepository) {
    this.adminRepository = adminRepository;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.adminRepository.findByEmail(email);
    return admin;
  }

  async getAllUsers(page: number, limit: number): Promise<PaginatedResponse> {
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
}

export default AdminService;
