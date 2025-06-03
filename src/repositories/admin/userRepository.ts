import prismaInstance from "../../libs/prismadb";
import { PaginatedResponse, User } from "../../services/interface/Iadmin";
import { IUserRepository } from "../interface/IadminRepositories";

export default class UserRepository implements IUserRepository {
  async getAllUsers(page: number = 1, limit: number = 8, searchQuery?: string): Promise<PaginatedResponse<User>> {
    try {
      const skip = (page - 1) * limit;
      
      // Build where clause for search
      const where: any = {};
      if (searchQuery) {
        where.OR = [
          { name: { contains: searchQuery, mode: "insensitive" } },
          { email: { contains: searchQuery, mode: "insensitive" } },
        ];
      }

      const total = await prismaInstance.user.count({ where });
      const users = await prismaInstance.user.findMany({
        where,
        skip,
        take: limit,
        select: { id: true, name: true, email: true, isBlocked: true, isRestricted: true, image: true },
        orderBy: { createdAt: "desc" },
      });

      const formattedUsers = users.map((user) => ({
        id: user.id,
        name: user.name ?? "Unknown",
        email: user.email ?? "No email provided",
        isBlocked: user.isBlocked,
        isRestricted: user.isRestricted,
        image: user.image,
      }));

      const totalPages = Math.ceil(total / limit);
      return { data: formattedUsers, total, currentPage: page, totalPages };
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