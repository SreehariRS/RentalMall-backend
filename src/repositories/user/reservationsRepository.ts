import { Prisma, Reservation } from "@prisma/client";
import prisma from "../../libs/prismadb";
import { CreateReservationParams, WalletUpdateParams, CreateNotificationParams } from "../../services/interface/Iuser";
import { IReservationsRepository } from "../interface/IUserRepositories";
import { BaseRepository } from "../baseRepository";

export class ReservationsRepository extends BaseRepository<
    Reservation,
    Prisma.ReservationWhereUniqueInput,
    Prisma.ReservationWhereInput,
    Prisma.ReservationOrderByWithRelationInput,
    Prisma.ReservationCreateInput,
    Prisma.ReservationUpdateInput,
    Prisma.ReservationSelect,
    Prisma.ReservationInclude
> implements IReservationsRepository {
    protected model = prisma.reservation as any;
    async createReservation(data: CreateReservationParams): Promise<any> {
        return await this.create({
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status as any,
            totalPrice: data.totalPrice,
            user: { connect: { id: data.userId } },
            listing: { connect: { id: data.listingId } },
        } as Prisma.ReservationCreateInput);
    }

    async findReservationById(reservationId: string): Promise<any> {
        return await this.findUnique(
            { id: reservationId },
            { include: { listing: true, user: { select: { email: true, id: true } } } as any }
        );
    }

    async deleteReservation(reservationId: string): Promise<any> {
        return await this.delete({ id: reservationId });
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