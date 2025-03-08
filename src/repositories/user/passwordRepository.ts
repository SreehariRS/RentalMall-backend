import { User } from "@prisma/client";
import prisma from "../../libs/prismadb";
import bcrypt from "bcrypt";

export class PasswordRepository {
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<User> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("User not found.");
        const isCorrectPassword = await bcrypt.compare(currentPassword, user.hashedPassword ?? "");
        if (!isCorrectPassword) throw new Error("Incorrect current password.");
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return await prisma.user.update({ where: { id: userId }, data: { hashedPassword } });
    }
}