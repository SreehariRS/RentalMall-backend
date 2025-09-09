import { Notification, Prisma } from "@prisma/client";
import prisma from "../../libs/prismadb";
import { DeleteNotificationParams, GetNotificationsParams, CreateNotificationParams } from "../../services/interface/Iuser";
import { INotificationsRepository } from "../interface/IUserRepositories";
import { BaseRepository } from "../baseRepository";

export class NotificationsRepository extends BaseRepository<
    Notification,
    Prisma.NotificationWhereUniqueInput,
    Prisma.NotificationWhereInput,
    Prisma.NotificationOrderByWithRelationInput,
    Prisma.NotificationCreateInput,
    Prisma.NotificationUpdateInput,
    Prisma.NotificationSelect,
    Prisma.NotificationInclude
> implements INotificationsRepository {
    protected model = prisma.notification as any;
    async getNotificationCount(userId: string): Promise<number> {
        return await this.model.count({ where: { userId, isRead: false } });
    }

    async deleteNotification(params: DeleteNotificationParams): Promise<any> {
        return await prisma.notification.deleteMany({ where: { id: params.notificationId, userId: params.userId } });
    }

    async getNotifications(params: GetNotificationsParams): Promise<any[]> {
        return await this.findMany({ where: { userId: params.userId } as any, orderBy: { createdAt: "desc" } as any });
    }

    async createNotification(params: CreateNotificationParams): Promise<any> {
        return await this.create({
            user: { connect: { id: params.userId } },
            message: params.message,
            type: params.type || "info",
        } as Prisma.NotificationCreateInput);
    }
}