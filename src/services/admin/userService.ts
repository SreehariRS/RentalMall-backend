import UserRepository from "../../repositories/admin/userRepository";
import { PaginatedResponse, User } from "../interface/Iadmin";

export default class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async getAllUsers(page: number, limit: number): Promise<PaginatedResponse<User>> {
        return await this.userRepository.getAllUsers(page, limit);
    }

    async blockUser(userId: string): Promise<User | null> {
        return await this.userRepository.blockUser(userId);
    }

    async unblockUser(userId: string): Promise<User | null> {
        return await this.userRepository.unblockUser(userId);
    }
}