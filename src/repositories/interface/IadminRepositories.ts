// src/repositories/interface/IadminRepositories.ts

import { Admin, User, Reservation, PaginatedResponse, DashboardStats } from "../../services/interface/Iadmin";

export interface IAuthRepository {
    findByEmail(email: string): Promise<Admin | null>;
}

export interface IUserRepository {
    getAllUsers(page: number, limit: number): Promise<PaginatedResponse<User>>;
    blockUser(userId: string): Promise<User | null>;
    unblockUser(userId: string): Promise<User | null>;
    restrictHost(userId: string): Promise<User | null>;
    unrestrictHost(userId: string): Promise<User | null>;
  }

export interface IReservationRepository {
    getAllReservations(page: number, limit: number): Promise<PaginatedResponse<Reservation>>;
}

export interface IHostRepository {
    getAllHosts(page: number, limit: number): Promise<PaginatedResponse<{ id: string; name: string; listingCount: number; isRestricted: boolean }>>;
}

export interface IDashboardRepository {
    getDashboardStats(): Promise<DashboardStats>;
}
export interface INotificationRepository {
    createNotification(userId: string, message: string, type: string): Promise<void>;
  }
export interface IAuthRepository {
    findByEmail(email: string): Promise<Admin | null>;
    findById(id: string): Promise<Admin | null>;
    updateTokens(id: string, accessToken: string, refreshToken: string): Promise<void>;
  }