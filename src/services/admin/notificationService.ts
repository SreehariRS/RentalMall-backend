import { INotificationRepository } from "../../repositories/interface/IadminRepositories";

export interface INotificationService {
  sendNotification(userId: string, message: string, type: string): Promise<void>;
}

export default class NotificationService implements INotificationService {
  private _notificationRepository: INotificationRepository;

  constructor(notificationRepository: INotificationRepository) {
    this._notificationRepository = notificationRepository;
  }

  async sendNotification(userId: string, message: string, type: string): Promise<void> {
    await this._notificationRepository.createNotification(userId, message, type);
  }
}