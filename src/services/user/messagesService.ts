import { CreateMessageParams, MarkMessageAsSeenParams } from "../interface/Iuser";
import { MessagesRepository } from "../../repositories/user/messagesRepository";

export class MessagesService {
    private messagesRepository: MessagesRepository;

    constructor(messagesRepository: MessagesRepository) {
        this.messagesRepository = messagesRepository;
    }

    async createMessage(params: CreateMessageParams) {
        return await this.messagesRepository.createMessage(params);
    }

    async updateConversationLastMessage(conversationId: string, messageId: string) {
        return await this.messagesRepository.updateConversationLastMessage(conversationId, messageId);
    }

    async markMessageAsSeen(params: MarkMessageAsSeenParams) {
        return await this.messagesRepository.markMessageAsSeen(params);
    }
}