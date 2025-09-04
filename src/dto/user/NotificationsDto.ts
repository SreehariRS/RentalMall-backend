export interface NotificationDto {
	id: string;
	userId: string;
	message: string;
	type?: string;
	isRead?: boolean;
	createdAt?: string;
}

export interface NotificationCountResponseDto {
	count: number;
}

export interface DeleteNotificationRequestDto {
	notificationId: string;
	userId: string;
}

export interface CreateNotificationRequestDto {
	userId: string;
	message: string;
	type?: string;
}

export interface GetNotificationsRequestDto {
	userId: string;
}
