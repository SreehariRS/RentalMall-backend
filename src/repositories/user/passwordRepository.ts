
import { User } from "@prisma/client";
import prisma from "../../libs/prismadb";
import bcrypt from "bcrypt";
import { IPasswordRepository } from "../interface/IUserRepositories";

export class PasswordRepository implements IPasswordRepository {
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<User> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("User not found.");
        const isCorrectPassword = await bcrypt.compare(currentPassword, user.hashedPassword ?? "");
        if (!isCorrectPassword) throw new Error("Incorrect current password.");
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return await prisma.user.update({ where: { id: userId }, data: { hashedPassword } });
    }
    async findUserByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({ where: { email } });
      }
    
      async updatePassword(email: string, hashedPassword: string): Promise<User> {
        return await prisma.user.update({
          where: { email },
          data: { hashedPassword },
        });
      }
    
      async deleteToken(tokenId: string): Promise<any> {
        return await prisma.verificationToken.delete({
          where: { id: tokenId },
        });
      }
}