import { INotificationRepository } from "../../repositories/interface/IadminRepositories";

export interface INotificationService {
  sendNotification(userId: string, message: string, type: string): Promise<void>;
}

export default class NotificationService implements INotificationService {
  private notificationRepository: INotificationRepository;

  constructor(notificationRepository: INotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async sendNotification(userId: string, message: string, type: string): Promise<void> {
    await this.notificationRepository.createNotification(userId, message, type);
  }
}