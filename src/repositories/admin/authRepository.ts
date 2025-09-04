import { BaseRepository } from "../baseRepository";
import { Admin } from "../../services/interface/Iadmin";
import { IAuthRepository } from "../interface/IadminRepositories";

export default class AuthRepository extends BaseRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<Admin | null> {
    try {
      const admin = await this.prisma.admin.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
          accessToken: true,
          refreshToken: true,
        },
      });
      

      if (!admin) return null;


      return {
        id: admin.id,
        email: admin.email,
        password: admin.password,
        role: admin.role,
        accessToken: admin.accessToken ?? undefined,
        refreshToken: admin.refreshToken ?? undefined,
      };
    } catch (error) {
      console.error(`Error in findByEmail: ${error}`); // Add detailed logging
      this.handleError(error, "findByEmail");
      return null; // Explicitly return null to avoid undefined behavior
    }
  }

  async findById(id: string): Promise<Admin | null> {
    try {
      const admin = await this.prisma.admin.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
          refreshToken: true,
          accessToken: true,
        },
      });

      if (!admin) return null;

      return {
        id: admin.id,
        email: admin.email,
        password: admin.password,
        role: admin.role,
        accessToken: admin.accessToken ?? undefined,
        refreshToken: admin.refreshToken ?? undefined,
      };
    } catch (error) {
      console.error(`Error in findById: ${error}`); // Add detailed logging
      this.handleError(error, "findById");
      return null; // Explicitly return null
    }
  }

  async updateTokens(id: string, accessToken: string, refreshToken: string): Promise<void> {
    try {
      await this.prisma.admin.update({
        where: { id },
        data: { accessToken, refreshToken },
      });
    } catch (error) {
      console.error(`Error in updateTokens: ${error}`); // Add detailed logging
      this.handleError(error, "updateTokens");
    }
  }
}