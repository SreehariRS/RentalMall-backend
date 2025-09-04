import { User, PaginatedResponse } from "../../services/interface/Iadmin";
import { 
  UserResponseDto, 
  UserListResponseDto, 
  UserBlockResponseDto 
} from "../admin/UserDto";

export class UserMapper {
  static toUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isBlocked: user.isBlocked,
      isRestricted: user.isRestricted,
      image: user.image
    };
  }

  static toUserResponseDtoArray(users: User[]): UserResponseDto[] {
    return users.map(user => this.toUserResponseDto(user));
  }

  static toUserListResponseDto(paginatedUsers: PaginatedResponse<User>): UserListResponseDto {
    return {
      data: this.toUserResponseDtoArray(paginatedUsers.data),
      total: paginatedUsers.total,
      currentPage: paginatedUsers.currentPage,
      totalPages: paginatedUsers.totalPages
    };
  }

  static toUserBlockResponseDto(user: User, action: string): UserBlockResponseDto {
    return {
      message: `User ${action} successfully`,
      user: this.toUserResponseDto(user)
    };
  }
}
