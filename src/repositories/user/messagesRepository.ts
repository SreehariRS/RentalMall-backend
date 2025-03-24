// src/repositories/user/messagesRepository.ts

import prisma from "../../libs/prismadb";
import { CreateMessageParams, MarkMessageAsSeenParams } from "../../services/interface/Iuser";
import { IMessagesRepository } from "../interface/IUserRepositories";

export class MessagesRepository implements IMessagesRepository {
    async createMessage(params: CreateMessageParams): Promise<any> {
        return await prisma.message.create({
            data: {
                body: params.message, image: params.image, conversation: { connect: { id: params.conversationId } },
                sender: { connect: { id: params.senderId } }, seen: { connect: { id: params.senderId } },
            },
            include: { seen: true, sender: true },
        });
    }

    async updateConversationLastMessage(conversationId: string, messageId: string): Promise<any> {
        return await prisma.conversation.update({
            where: { id: conversationId },
            data: { lastMessageAt: new Date(), messages: { connect: { id: messageId } } },
            include: { users: true, messages: { include: { seen: true } } },
        });
    }

    async markMessageAsSeen(params: MarkMessageAsSeenParams): Promise<any> {
        const { conversationId, userId } = params;
        const conversation = await prisma.conversation.findUnique({ where: { id: conversationId }, include: { messages: { include: { seen: true } }, users: true } });
        if (!conversation) throw new Error("Invalid conversation ID");
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        if (!lastMessage) return conversation;
        return await prisma.message.update({ where: { id: lastMessage.id }, data: { seen: { connect: { id: userId } } }, include: { sender: true, seen: true } });
    }
}