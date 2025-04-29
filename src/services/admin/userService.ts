import UserRepository from "../../repositories/admin/userRepository";
import { IUserService, PaginatedResponse, User } from "../interface/Iadmin";

export default class UserService implements IUserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers(page: number, limit: number, search: string = ""): Promise<PaginatedResponse<User>> {
    return await this.userRepository.getAllUsers(page, limit, search);
  }

  async blockUser(userId: string): Promise<User | null> {
    return await this.userRepository.blockUser(userId);
  }

  async unblockUser(userId: string): Promise<User | null> {
    return await this.userRepository.unblockUser(userId);
  }

  async restrictHost(userId: string): Promise<User | null> {
    return await this.userRepository.restrictHost(userId);
  }

  async unrestrictHost(userId: string): Promise<User | null> {
    return await this.userRepository.unrestrictHost(userId);
  }
}