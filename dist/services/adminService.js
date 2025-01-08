"use strict";
// In services/adminService.ts
Object.defineProperty(exports, "__esModule", { value: true });
class AdminService {
    adminRepository;
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async findByEmail(email) {
        const admin = await this.adminRepository.findByEmail(email);
        return admin;
    }
    async getAllUsers(page, limit) {
        return await this.adminRepository.getAllUsers(page, limit);
    }
    async blockUser(userId) {
        const user = await this.adminRepository.blockUser(userId);
        return user;
    }
    async unblockUser(userId) {
        const user = await this.adminRepository.unblockUser(userId);
        return user;
    }
}
exports.default = AdminService;
