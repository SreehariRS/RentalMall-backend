import prismaInstance from "../libs/prismadb";

export abstract class BaseRepository {
    protected prisma = prismaInstance;

    protected calculatePagination(total: number, page: number, limit: number): { skip: number; totalPages: number } {
        const skip = (page - 1) * limit;
        const totalPages = Math.ceil(total / limit);
        return { skip, totalPages };
    }

    protected handleError(error: unknown, context: string): never {
        console.error(`Error in ${context}:`, error);
        throw error instanceof Error ? error : new Error(`Unexpected error in ${context}`);
    }
}