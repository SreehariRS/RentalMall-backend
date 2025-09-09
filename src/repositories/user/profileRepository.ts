import { Prisma, User } from "@prisma/client";
import prisma from "../../libs/prismadb";
import { IProfileRepository } from "../interface/IUserRepositories";
import { BaseRepository } from "../baseRepository";

export class ProfileRepository extends BaseRepository<
    User,
    Prisma.UserWhereUniqueInput,
    Prisma.UserWhereInput,
    Prisma.UserOrderByWithRelationInput,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput,
    Prisma.UserSelect,
    Prisma.UserInclude
> implements IProfileRepository {
    protected model = prisma.user as any;
    async findByEmail(email: string): Promise<User | null> {
        console.log("Finding user with email:", email);
        const getUser = await this.findOne({ where: { email } as any });
        console.log("User found:", getUser);
        return getUser;
    }

    async updateProfileImage(userId: string, imageUrl: string): Promise<User> {
        return await this.update({ id: userId }, { image: imageUrl } as any);
    }

    async updateAbout(userId: string, about: string): Promise<User> {
        return await this.update({ id: userId }, { about } as any);
    }
}