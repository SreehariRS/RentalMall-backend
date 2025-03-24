import { Request, Response } from "express";
import { INotificationService } from "../../services/interface/Iadmin";

export class NotificationController {
  private notificationService: INotificationService;

  constructor(notificationService: INotificationService) {
    this.notificationService = notificationService;
  }

  async sendNotification(req: Request, res: Response): Promise<void> {
    try {
      const { userId, message, type } = req.body;
      if (!userId || !message || !type) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }
      await this.notificationService.sendNotification(userId, message, type);
      res.status(200).json({ message: "Notification sent successfully" });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ message: "Failed to send notification" });
    }
  }
}