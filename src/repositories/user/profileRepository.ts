// src/repositories/user/profileRepository.ts

import { User } from "@prisma/client";
import prisma from "../../libs/prismadb";
import { IProfileRepository } from "../interface/IUserRepositories";

export class ProfileRepository implements IProfileRepository {
    async findByEmail(email: string): Promise<User | null> {
        console.log("Finding user with email:", email);
        const getUser = await prisma.user.findUnique({ where: { email } });
        console.log("User found:", getUser);
        return getUser;
    }

    async updateProfileImage(userId: string, imageUrl: string): Promise<User> {
        return await prisma.user.update({ where: { id: userId }, data: { image: imageUrl } });
    }

    async updateAbout(userId: string, about: string): Promise<User> {
        return await prisma.user.update({ where: { id: userId }, data: { about } });
    }
}