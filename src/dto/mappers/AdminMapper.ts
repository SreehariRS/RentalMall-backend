import { Admin } from "../../services/interface/Iadmin";
import { 
  AdminResponseDto, 
  AdminLoginResponseDto, 
  AdminRefreshResponseDto 
} from "../admin/AdminDto";

export class AdminMapper {
  static toAdminResponseDto(admin: Admin): AdminResponseDto {
    return {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      accessToken: admin.accessToken,
      refreshToken: admin.refreshToken
    };
  }

  static toAdminLoginResponseDto(
    admin: Admin, 
    accessToken: string, 
    refreshToken: string
  ): AdminLoginResponseDto {
    return {
      message: "Login successful",
      accessToken,
      refreshToken
    };
  }

  static toAdminRefreshResponseDto(accessToken: string): AdminRefreshResponseDto {
    return {
      message: "Token refreshed",
      accessToken
    };
  }

  static toAdminResponseDtoArray(admins: Admin[]): AdminResponseDto[] {
    return admins.map(admin => this.toAdminResponseDto(admin));
  }
}
