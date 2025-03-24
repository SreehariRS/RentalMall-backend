
import { IMessagesService, CreateMessageParams, MarkMessageAsSeenParams } from "../interface/Iuser";
import { IMessagesRepository } from "../../repositories/interface/IUserRepositories";

export class MessagesService implements IMessagesService {
    private messagesRepository: IMessagesRepository;

    constructor(messagesRepository: IMessagesRepository) {
        this.messagesRepository = messagesRepository;
    }

    async createMessage(params: CreateMessageParams): Promise<any> {
        return await this.messagesRepository.createMessage(params);
    }

    async updateConversationLastMessage(conversationId: string, messageId: string): Promise<any> {
        return await this.messagesRepository.updateConversationLastMessage(conversationId, messageId);
    }

    async markMessageAsSeen(params: MarkMessageAsSeenParams): Promise<any> {
        return await this.messagesRepository.markMessageAsSeen(params);
    }
}