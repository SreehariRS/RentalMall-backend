"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepositoryImplementation = void 0;
const prismadb_1 = __importDefault(require("../libs/prismadb"));
class AdminRepositoryImplementation {
    async findByEmail(email) {
        const admin = await prismadb_1.default.admin.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
            },
        });
        if (!admin)
            return null;
        return {
            id: admin.id,
            email: admin.email,
            password: admin.password,
        };
    }
    async getAllUsers(page = 1, limit = 8) {
        try {
            // Calculate skip value for pagination
            const skip = (page - 1) * limit;
            // Get total count of users
            const total = await prismadb_1.default.user.count();
            // Get paginated users
            const users = await prismadb_1.default.user.findMany({
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
        }
        catch (error) {
            console.error("Error in getAllUsers:", error);
            throw error;
        }
    }
    async blockUser(userId) {
        const user = await prismadb_1.default.user.update({
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
        if (!user)
            return null;
        return {
            id: user.id,
            name: user.name ?? "Unknown",
            email: user.email ?? "No email provided",
            isBlocked: user.isBlocked,
            image: user.image,
        };
    }
    async unblockUser(userId) {
        const user = await prismadb_1.default.user.update({
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
        if (!user)
            return null;
        return {
            id: user.id,
            name: user.name ?? "Unknown",
            email: user.email ?? "No email provided",
            isBlocked: user.isBlocked,
            image: user.image,
        };
    }
}
exports.AdminRepositoryImplementation = AdminRepositoryImplementation;
