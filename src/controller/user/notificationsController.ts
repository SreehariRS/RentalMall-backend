import { Request, Response } from "express";
import { INotificationsService } from "../../services/interface/Iuser";
import { INotificationsController } from "../interface/IuserController";
import { HttpStatusCodes } from "../../config/HttpStatusCodes";
import { Messages } from "../../config/message";
import { pusherServer } from "../../libs/pusher";
import prisma from "../../libs/prismadb";

export class NotificationsController implements INotificationsController {
    private _notificationsService: INotificationsService;

    constructor(notificationsService: INotificationsService) {
        this._notificationsService = notificationsService;
    }

    async getNotificationCount(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user.userId;
            const count = await this._notificationsService.getNotificationCount(userId);
            return res
                .status(HttpStatusCodes.OK)
                .json({ status: true, message: Messages.NOTIFICATION_COUNT_FETCHED_SUCCESS, data: { count } });
        } catch (error: any) {
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
        }
    }

    async deleteNotification(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) return res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
            const { notificationId } = req.params;
            if (!notificationId || typeof notificationId !== "string")
                return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: Messages.INVALID_ID });
            const notification = await this._notificationsService.deleteNotification({
                notificationId,
                userId: currentUser.id,
            });
            await pusherServer.trigger(
                `user-${currentUser.email}-notifications`,
                "notification:remove",
                notificationId
            );
            return res.status(HttpStatusCodes.OK).json(notification);
        } catch (error) {
            console.error("DELETE_NOTIFICATION_ERROR", error);
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR });
        }
    }

    async getNotifications(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) return res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
            const notifications = await this._notificationsService.getNotifications({ userId: currentUser.id });
            return res.status(HttpStatusCodes.OK).json(notifications);
        } catch (error) {
            console.error("GET_NOTIFICATIONS_ERROR", error);
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR });
        }
    }

    async createNotification(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            if (!currentUser) return res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
            const { userId, message, type } = req.body;
            if (!userId || !message)
                return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: Messages.MISSING_REQUIRED_FIELDS });
            const notification = await this._notificationsService.createNotification({ userId, message, type });
            const recipient = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
            if (recipient?.email) {
                await pusherServer.trigger(`user-${recipient.email}-notifications`, "notification:new", notification);
            }
            return res.status(HttpStatusCodes.OK).json(notification);
        } catch (error) {
            console.error("CREATE_NOTIFICATION_ERROR", error);
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR });
        }
    }
}