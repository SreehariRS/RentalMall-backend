import prismaInstance from "../libs/prismadb";
import AdminRepository from "./interface/IadminRepository";

interface Admin {
  id: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  image: string | null;
}

interface PaginatedResponse {
  users: User[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export class AdminRepositoryImplementation implements AdminRepository {
  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await prismaInstance.admin.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    if (!admin) return null;

    return {
      id: admin.id,
      email: admin.email,
      password: admin.password,
    };
  }

  async getAllUsers(page: number = 1, limit: number = 8): Promise<PaginatedResponse> {
    try {
      // Calculate skip value for pagination
      const skip = (page - 1) * limit;

      // Get total count of users
      const total = await prismaInstance.user.count();

      // Get paginated users
      const users = await prismaInstance.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          isBlocked: true,
          image: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Format users data
      const formattedUsers = users.map((user) => ({
        id: user.id,
        name: user.name ?? "Unknown",
        email: user.email ?? "No email provided",
        isBlocked: user.isBlocked,
        image: user.image,
      }));

      // Calculate total pages
      const totalPages = Math.ceil(total / limit);

      // Return paginated response
      return {
        users: formattedUsers,
        total,
        currentPage: page,
        totalPages,
      };
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      throw error;
    }
  }

  async blockUser(userId: string): Promise<User | null> {
    const user = await prismaInstance.user.update({
      where: { id: userId },
      data: { isBlocked: true },
      select: {
        id: true,
        name: true,
        email: true,
        isBlocked: true,
        image: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name ?? "Unknown",
      email: user.email ?? "No email provided",
      isBlocked: user.isBlocked,
      image: user.image,
    };
  }

  async unblockUser(userId: string): Promise<User | null> {
    const user = await prismaInstance.user.update({
      where: { id: userId },
      data: { isBlocked: false },
      select: {
        id: true,
        name: true,
        email: true,
        isBlocked: true,
        image: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name ?? "Unknown",
      email: user.email ?? "No email provided",
      isBlocked: user.isBlocked,
      image: user.image,
    };
  }
}

export { AdminRepository };