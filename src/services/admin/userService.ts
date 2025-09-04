import { IUserRepository } from "../../repositories/interface/IadminRepositories";
import { IUserService, User, PaginatedResponse } from "../interface/Iadmin";
import { UserMapper } from "../../dto/mappers";

export default class UserService implements IUserService {
  private _userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this._userRepository = userRepository;
  }

  async getAllUsers(page: number, limit: number, searchQuery?: string): Promise<import("../../dto/admin").UserListResponseDto> {
    const paginatedUsers = await this._userRepository.getAllUsers(page, limit, searchQuery);
    // Use DTO mapper to return properly formatted response
    return UserMapper.toUserListResponseDto(paginatedUsers);
  }

  async blockUser(userId: string): Promise<import("../../dto/admin").UserResponseDto | null> {
    const user = await this._userRepository.blockUser(userId);
    if (!user) return null;
    
    // Use DTO mapper to return properly formatted response
    return UserMapper.toUserResponseDto(user);
  }

  async unblockUser(userId: string): Promise<import("../../dto/admin").UserResponseDto | null> {
    const user = await this._userRepository.unblockUser(userId);
    if (!user) return null;
    
    // Use DTO mapper to return properly formatted response
    return UserMapper.toUserResponseDto(user);
  }

  async restrictHost(userId: string): Promise<import("../../dto/admin").UserResponseDto | null> {
    const user = await this._userRepository.restrictHost(userId);
    if (!user) return null;
    
    // Use DTO mapper to return properly formatted response
    return UserMapper.toUserResponseDto(user);
  }

  async unrestrictHost(userId: string): Promise<import("../../dto/admin").UserResponseDto | null> {
    const user = await this._userRepository.unrestrictHost(userId);
    if (!user) return null;
    
    // Use DTO mapper to return properly formatted response
    return UserMapper.toUserResponseDto(user);
  }
}