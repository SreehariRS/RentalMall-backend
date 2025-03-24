
import { INotificationsService, DeleteNotificationParams, GetNotificationsParams, CreateNotificationParams } from "../interface/Iuser";
import { INotificationsRepository } from "../../repositories/interface/IUserRepositories";

export class NotificationsService implements INotificationsService {
    private notificationsRepository: INotificationsRepository;

    constructor(notificationsRepository: INotificationsRepository) {
        this.notificationsRepository = notificationsRepository;
    }

    async getNotificationCount(userId: string): Promise<number> {
        if (!userId) throw new Error("User ID is required.");
        return await this.notificationsRepository.getNotificationCount(userId);
    }

    async deleteNotification(params: DeleteNotificationParams): Promise<any> {
        return await this.notificationsRepository.deleteNotification(params);
    }

    async getNotifications(params: GetNotificationsParams): Promise<any> {
        return await this.notificationsRepository.getNotifications(params);
    }

    async createNotification(params: CreateNotificationParams): Promise<any> {
        return await this.notificationsRepository.createNotification(params);
    }
}