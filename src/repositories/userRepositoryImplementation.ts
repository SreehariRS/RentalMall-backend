import { UserRepository } from './interface/userRepository';
import prisma from '../libs/prismadb';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

export class UserRepositoryImplementation implements UserRepository {
  // Add a listing to the user's favorites
  async addFavorite(userId: string, listingId: string): Promise<User> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { favoriteIds: { push: listingId } },
    });
    return user;
  }

  // Remove a listing from the user's favorites
  async removeFavorite(userId: string, listingId: string): Promise<User> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        favoriteIds: {
          set: (
            await prisma.user.findUnique({ where: { id: userId } })
          )?.favoriteIds.filter((id) => id !== listingId),
        },
      },
    });
    return user;
  }

  //profile
async findByEmail(email: string): Promise<User | null> {
  console.log("Finding user with email:", email); // Debug log
  const getUser = await prisma.user.findUnique({
    where: { email },
  });
  console.log("User found:", getUser); // Debug log
  return getUser;
}

//change password
async changePassword(userId: string, newPassword: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the password
  const user = await prisma.user.update({
    where: { id: userId },
    data: { hashedPassword },
  });
  return user;
}

}
