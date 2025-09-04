export interface MessageDto {
	id: string;
	message?: string;
	image?: string;
	conversationId: string;
	senderId: string;
	createdAt?: string;
}

export interface CreateMessageRequestDto {
	message?: string;
	image?: string;
	conversationId: string;
}

export interface MarkSeenRequestDto {
	conversationId: string;
	userId: string;
	userEmail: string;
}
