import prismaInstance from "../../libs/prismadb";
import { Prisma, User as PrismaUser } from "@prisma/client";
import { PaginatedResponse, User } from "../../services/interface/Iadmin";
import { IUserRepository } from "../interface/IadminRepositories";
import { BaseRepository } from "../baseRepository";

export default class UserRepository extends BaseRepository<
  PrismaUser,
  Prisma.UserWhereUniqueInput,
  Prisma.UserWhereInput,
  Prisma.UserOrderByWithRelationInput,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserSelect,
  Prisma.UserInclude
> implements IUserRepository {
  protected model = prismaInstance.user as any;
  async getAllUsers(page: number = 1, limit: number = 8, searchQuery?: string): Promise<PaginatedResponse<User>> {
    try {
      const where: Prisma.UserWhereInput | undefined = searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery, mode: "insensitive" } },
              { email: { contains: searchQuery, mode: "insensitive" } },
            ],
          }
        : undefined;

      const result = await this.findManyPaginated({
        where,
        orderBy: { createdAt: "desc" },
        page,
        limit,
        select: { id: true, name: true, email: true, isBlocked: true, isRestricted: true, image: true } as any,
      });

      const formattedUsers = result.data.map((user) => ({
        id: user.id,
        name: user.name ?? "Unknown",
        email: user.email ?? "No email provided",
        isBlocked: user.isBlocked,
        isRestricted: user.isRestricted,
        image: user.image,
      }));

      return { data: formattedUsers, total: result.total, currentPage: result.page, totalPages: result.totalPages };
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      throw error;
    }
  }

  async blockUser(userId: string): Promise<User | null> {
    const user = await prismaInstance.user.update({
      where: { id: userId },
      data: { isBlocked: true },
      select: { id: true, name: true, email: true, isBlocked: true, isRestricted: true, image: true },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name ?? "Unknown",
      email: user.email ?? "No email provided",
      isBlocked: user.isBlocked,
      isRestricted: user.isRestricted,
      image: user.image,
    };
  }

  async unblockUser(userId: string): Promise<User | null> {
    const user = await prismaInstance.user.update({
      where: { id: userId },
      data: { isBlocked: false },
      select: { id: true, name: true, email: true, isBlocked: true, isRestricted: true, image: true },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name ?? "Unknown",
      email: user.email ?? "No email provided",
      isBlocked: user.isBlocked,
      isRestricted: user.isRestricted,
      image: user.image,
    };
  }

  async restrictHost(userId: string): Promise<User | null> {
    const user = await prismaInstance.user.update({
      where: { id: userId },
      data: { isRestricted: true },
      select: { id: true, name: true, email: true, isBlocked: true, isRestricted: true, image: true },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name ?? "Unknown",
      email: user.email ?? "No email provided",
      isBlocked: user.isBlocked,
      isRestricted: user.isRestricted,
      image: user.image,
    };
  }

  async unrestrictHost(userId: string): Promise<User | null> {
    const user = await prismaInstance.user.update({
      where: { id: userId },
      data: { isRestricted: false },
      select: { id: true, name: true, email: true, isBlocked: true, isRestricted: true, image: true },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name ?? "Unknown",
      email: user.email ?? "No email provided",
      isBlocked: user.isBlocked,
      isRestricted: user.isRestricted,
      image: user.image,
    };
  }
}