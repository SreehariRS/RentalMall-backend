import { BaseRepository } from "../baseRepository";
import { Prisma, Admin as PrismaAdmin } from "@prisma/client";
import prismaInstance from "../../libs/prismadb"; 
import { Admin } from "../../services/interface/Iadmin";
import { IAuthRepository } from "../interface/IadminRepositories";

export default class AuthRepository extends BaseRepository<
  PrismaAdmin,
  Prisma.AdminWhereUniqueInput,
  Prisma.AdminWhereInput,
  Prisma.AdminOrderByWithRelationInput,
  Prisma.AdminCreateInput,
  Prisma.AdminUpdateInput,
  Prisma.AdminSelect,
  undefined 
> implements IAuthRepository {
  protected model = prismaInstance.admin;

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
      console.error(`Error in findByEmail: ${error}`);
      this.handleError(error, "findByEmail");
      return null;
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
      console.error(`Error in findById: ${error}`);
      this.handleError(error, "findById");
      return null;
    }
  }

  async updateTokens(id: string, accessToken: string, refreshToken: string): Promise<void> {
    try {
      await this.prisma.admin.update({
        where: { id },
        data: { accessToken, refreshToken },
      });
    } catch (error) {
      console.error(`Error in updateTokens: ${error}`);
      this.handleError(error, "updateTokens");
    }
  }
}