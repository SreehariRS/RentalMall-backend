import { BaseRepository } from "../baseRepository";
import { INotificationRepository } from "../interface/IadminRepositories";

export default class NotificationRepository extends BaseRepository implements INotificationRepository {
  async createNotification(userId: string, message: string, type: string): Promise<void> {
    try {
      await this.prisma.notification.create({
        data: {
          userId,
          message,
          type,
        },
      });
    } catch (error) {
      this.handleError(error, "createNotification");
    }
  }
}