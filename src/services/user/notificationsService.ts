import { DeleteNotificationParams, GetNotificationsParams, CreateNotificationParams } from "../interface/Iuser";
import { NotificationsRepository } from "../../repositories/user/notificationsRepository";

export class NotificationsService {
    private notificationsRepository: NotificationsRepository;

    constructor(notificationsRepository: NotificationsRepository) {
        this.notificationsRepository = notificationsRepository;
    }

    async getNotificationCount(userId: string): Promise<number> {
        if (!userId) throw new Error("User ID is required.");
        return await this.notificationsRepository.getNotificationCount(userId);
    }

    async deleteNotification(params: DeleteNotificationParams) {
        return await this.notificationsRepository.deleteNotification(params);
    }

    async getNotifications(params: GetNotificationsParams) {
        return await this.notificationsRepository.getNotifications(params);
    }

    async createNotification(params: CreateNotificationParams) {
        return await this.notificationsRepository.createNotification(params);
    }
}