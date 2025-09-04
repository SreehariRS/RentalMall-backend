import { Message } from "@prisma/client";
import { MessageDto } from "../../user";

export class MessagesMapper {
	static toMessageDto(message: Message & { seen?: any[]; sender?: any }): MessageDto {
		return {
			id: message.id,
			message: (message as any).body ?? undefined,
			image: (message as any).image ?? undefined,
			conversationId: message.conversationId,
			senderId: message.senderId,
			createdAt: (message as any).createdAt?.toISOString?.() ?? undefined,
		};
	}
}
