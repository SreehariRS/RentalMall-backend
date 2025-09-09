import prismaInstance from "../libs/prismadb";
import { Prisma } from "@prisma/client";

export type PaginationParams = { page?: number; limit?: number };
export type PaginatedResult<T> = {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

type FindManyArgs<Where, OrderBy, Select, Include> = {
    where?: Where;
    orderBy?: OrderBy;
    skip?: number;
    take?: number;
    select?: Select;
    include?: Include;
};

type FindUniqueArgs<WhereUnique, Select, Include> = {
    where: WhereUnique;
    select?: Select;
    include?: Include;
};

type CreateArgs<Create, Select, Include> = {
    data: Create;
    select?: Select;
    include?: Include;
};

type UpdateArgs<WhereUnique, Update, Select, Include> = {
    where: WhereUnique;
    data: Update;
    select?: Select;
    include?: Include;
};

type DeleteArgs<WhereUnique> = { where: WhereUnique };

export interface GenericModelDelegate<T, WhereUnique, Where, OrderBy, Create, Update, Select, Include> {
    findUnique(args: FindUniqueArgs<WhereUnique, Select, Include>): Promise<T | null>;
    findFirst(args: FindManyArgs<Where, OrderBy, Select, Include>): Promise<T | null>;
    findMany(args: FindManyArgs<Where, OrderBy, Select, Include>): Promise<T[]>;
    create(args: CreateArgs<Create, Select, Include>): Promise<T>;
    update(args: UpdateArgs<WhereUnique, Update, Select, Include>): Promise<T>;
    delete(args: DeleteArgs<WhereUnique>): Promise<T>;
    count(args: { where?: Where }): Promise<number>;
}

export abstract class BaseRepository<
    TEntity,
    WhereUnique,
    Where,
    OrderBy,
    Create,
    Update,
    Select = undefined,
    Include = undefined
> {
    protected prisma = prismaInstance;
    protected abstract model: GenericModelDelegate<TEntity, WhereUnique, Where, OrderBy, Create, Update, Select, Include>;

    protected calculatePagination(total: number, page: number, limit: number): { skip: number; totalPages: number } {
        const safePage = Math.max(1, page || 1);
        const safeLimit = Math.max(1, Math.min(limit || 10, 100));
        const skip = (safePage - 1) * safeLimit;
        const totalPages = Math.ceil(total / safeLimit) || 1;
        return { skip, totalPages };
    }

    protected handleError(error: unknown, context: string): never {
        // Centralized error logging; rethrow to let upper layers handle
        console.error(`Error in ${context}:`, error);
        throw error instanceof Error ? error : new Error(String(error));
    }

    async create(data: Create, options?: { select?: Select; include?: Include }): Promise<TEntity> {
        try {
            return await this.model.create({ data, ...(options || {}) } as any);
        } catch (error) {
            this.handleError(error, "BaseRepository.create");
        }
    }

    async findUnique(where: WhereUnique, options?: { select?: Select; include?: Include }): Promise<TEntity | null> {
        try {
            return await this.model.findUnique({ where, ...(options || {}) } as any);
        } catch (error) {
            this.handleError(error, "BaseRepository.findUnique");
        }
    }

    async findOne(params: { where?: Where; orderBy?: OrderBy; select?: Select; include?: Include }): Promise<TEntity | null> {
        try {
            const { where, orderBy, select, include } = params || {} as any;
            return await this.model.findFirst({ where, orderBy, select, include } as any);
        } catch (error) {
            this.handleError(error, "BaseRepository.findOne");
        }
    }

    async findMany(params?: {
        where?: Where;
        orderBy?: OrderBy;
        select?: Select;
        include?: Include;
    }): Promise<TEntity[]> {
        try {
            const { where, orderBy, select, include } = params || {} as any;
            return await this.model.findMany({ where, orderBy, select, include } as any);
        } catch (error) {
            this.handleError(error, "BaseRepository.findMany");
        }
    }

    async findManyPaginated(params?: {
        where?: Where;
        orderBy?: OrderBy;
        page?: number;
        limit?: number;
        select?: Select;
        include?: Include;
    }): Promise<PaginatedResult<TEntity>> {
        try {
            const { where, orderBy, page = 1, limit = 10, select, include } = params || {} as any;
            const total = await this.model.count({ where } as any);
            const { skip, totalPages } = this.calculatePagination(total, page, limit);
            const data = await this.model.findMany({ where, orderBy, skip, take: limit, select, include } as any);
            return { data, page, limit, total, totalPages };
        } catch (error) {
            this.handleError(error, "BaseRepository.findManyPaginated");
        }
    }

    async update(where: WhereUnique, data: Update, options?: { select?: Select; include?: Include }): Promise<TEntity> {
        try {
            return await this.model.update({ where, data, ...(options || {}) } as any);
        } catch (error) {
            this.handleError(error, "BaseRepository.update");
        }
    }

    async delete(where: WhereUnique): Promise<TEntity> {
        try {
            return await this.model.delete({ where } as any);
        } catch (error) {
            this.handleError(error, "BaseRepository.delete");
        }
    }
}