import { Notification } from "@prisma/client";
import { NotificationDto, NotificationCountResponseDto } from "../../user";

export class NotificationsMapper {
	static toNotificationDto(notification: Notification): NotificationDto {
		return {
			id: notification.id,
			userId: notification.userId,
			message: notification.message,
			type: (notification as any).type,
			isRead: (notification as any).isRead,
			createdAt: (notification as any).createdAt?.toISOString?.(),
		};
	}

	static toNotificationCountResponseDto(count: number): NotificationCountResponseDto {
		return { count };
	}
}
