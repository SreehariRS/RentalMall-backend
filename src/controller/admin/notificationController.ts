import { Request, Response } from "express";
import { INotificationService } from "../../services/interface/Iadmin";
import { HttpStatusCodes } from "../../config/HttpStatusCodes";
import { Messages } from "../../config/message";

export class NotificationController {
  private _notificationService: INotificationService;

  constructor(notificationService: INotificationService) {
    this._notificationService = notificationService;
  }

  async sendNotification(req: Request, res: Response): Promise<void> {
    try {
      const { userId, message, type } = req.body;
      if (!userId || !message || !type) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: Messages.MISSING_REQUIRED_FIELDS });
        return;
      }
      await this._notificationService.sendNotification(userId, message, type);
      res.status(HttpStatusCodes.OK).json({ message: Messages.NOTIFICATION_SENT_SUCCESS });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.FAILED_TO_SEND_NOTIFICATION });
    }
  }
}