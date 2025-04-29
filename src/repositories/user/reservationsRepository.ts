
import prisma from "../../libs/prismadb";
import { CreateReservationParams, CancelReservationParams, WalletUpdateParams, CreateNotificationParams } from "../../services/interface/Iuser";
import { IReservationsRepository } from "../interface/IUserRepositories";

export class ReservationsRepository implements IReservationsRepository {
    async createReservation(data: CreateReservationParams): Promise<any> {
        return await prisma.reservation.create({ data });
    }

    async findReservationById(reservationId: string): Promise<any> {
        return await prisma.reservation.findUnique({ where: { id: reservationId }, include: { listing: true, user: { select: { email: true, id: true } } } });
    }

    async deleteReservation(reservationId: string): Promise<any> {
        return await prisma.reservation.delete({ where: { id: reservationId } });
    }

    async refundToWallet(params: WalletUpdateParams): Promise<any> {
        return await prisma.wallet.update({ where: { userId: params.userId }, data: { balance: { increment: params.amount } } });
    }

    async createCancelledReservation(params: any): Promise<any> {
        return await prisma.cancelledReservation.create({ data: params });
    }

    async createNotification(params: CreateNotificationParams): Promise<any> {
        return await prisma.notification.create({ data: { userId: params.userId, message: params.message, type: params.type || "info" } });
    }

    async getOrCreateWallet(userId: string): Promise<any> {
        let wallet = await prisma.wallet.findUnique({ where: { userId } });
        if (!wallet) {
            wallet = await prisma.wallet.create({ data: { userId, balance: 0 } });
        }
        return wallet;
    }
}