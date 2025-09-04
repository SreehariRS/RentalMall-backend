import { IMessagesService, CreateMessageParams, MarkMessageAsSeenParams } from "../interface/Iuser";
import { IMessagesRepository } from "../../repositories/interface/IUserRepositories";
import { MessagesMapper } from "../../dto/mappers/user/MessagesMapper";

export class MessagesService implements IMessagesService {
    private _messagesRepository: IMessagesRepository;

    constructor(messagesRepository: IMessagesRepository) {
        this._messagesRepository = messagesRepository;
    }

    async createMessage(params: CreateMessageParams): Promise<any> {
        const message = await this._messagesRepository.createMessage(params);
        return MessagesMapper.toMessageDto(message);
    }

    async updateConversationLastMessage(conversationId: string, messageId: string): Promise<any> {
        return await this._messagesRepository.updateConversationLastMessage(conversationId, messageId);
    }

    async markMessageAsSeen(params: MarkMessageAsSeenParams): Promise<any> {
        const updated = await this._messagesRepository.markMessageAsSeen(params);
        return updated;
    }
}