

import { User } from '@prisma/client';

export interface UserRepository {
  addFavorite(userId: string, listingId: string): Promise<User>;
  removeFavorite(userId: string, listingId: string): Promise<User>;
  findByEmail(email:String):Promise<User | null>;
  changePassword(userId: string, newPassword: string): Promise<User>;
}
