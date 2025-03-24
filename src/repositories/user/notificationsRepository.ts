// src/repositories/user/notificationsRepository.ts

import prisma from "../../libs/prismadb";
import { DeleteNotificationParams, GetNotificationsParams, CreateNotificationParams } from "../../services/interface/Iuser";
import { INotificationsRepository } from "../interface/IUserRepositories";

export class NotificationsRepository implements INotificationsRepository {
    async getNotificationCount(userId: string): Promise<number> {
        return await prisma.notification.count({ where: { userId, isRead: false } });
    }

    async deleteNotification(params: DeleteNotificationParams): Promise<any> {
        return await prisma.notification.deleteMany({ where: { id: params.notificationId, userId: params.userId } });
    }

    async getNotifications(params: GetNotificationsParams): Promise<any[]> {
        return await prisma.notification.findMany({ where: { userId: params.userId }, orderBy: { createdAt: "desc" } });
    }

    async createNotification(params: CreateNotificationParams): Promise<any> {
        return await prisma.notification.create({ data: { userId: params.userId, message: params.message, type: params.type || "info" } });
    }
}