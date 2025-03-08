import { Request, Response } from "express";
import { NotificationsService } from "../../services/user/notificationsService";
import { pusherServer } from "../../libs/pusher";
import prisma from "../../libs/prismadb";

export class NotificationsController {
    private notificationsService: NotificationsService;

    constructor(notificationsService: NotificationsService) {
        this.notificationsService = notificationsService;
    }

    async getNotificationCount(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user.userId;
            const count = await this.notificationsService.getNotificationCount(userId);
            return res.status(200).json({ status: true, message: "Notification count fetched successfully", data: { count } });
        } catch (error: any) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }

    async deleteNotification(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) return res.status(401).json({ message: "Unauthorized" });
            const { notificationId } = req.params;
            if (!notificationId || typeof notificationId !== "string") return res.status(400).json({ message: "Invalid ID" });
            const notification = await this.notificationsService.deleteNotification({ notificationId, userId: currentUser.id });
            await pusherServer.trigger(`user-${currentUser.email}-notifications`, "notification:remove", notificationId);
            return res.status(200).json(notification);
        } catch (error) {
            console.error("DELETE_NOTIFICATION_ERROR", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async getNotifications(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) return res.status(401).json({ message: "Unauthorized" });
            const notifications = await this.notificationsService.getNotifications({ userId: currentUser.id });
            return res.status(200).json(notifications);
        } catch (error) {
            console.error("GET_NOTIFICATIONS_ERROR", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async createNotification(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) return res.status(401).json({ message: "Unauthorized" });
            const { userId, message, type } = req.body;
            if (!userId || !message) return res.status(400).json({ message: "Missing required fields" });
            const notification = await this.notificationsService.createNotification({ userId, message, type });
            const recipient = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
            if (recipient?.email) {
                await pusherServer.trigger(`user-${recipient.email}-notifications`, "notification:new", notification);
            }
            return res.status(200).json(notification);
        } catch (error) {
            console.error("CREATE_NOTIFICATION_ERROR", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}