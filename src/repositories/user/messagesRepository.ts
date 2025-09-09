import { Message, Prisma } from "@prisma/client";
import prisma from "../../libs/prismadb";
import { CreateMessageParams, MarkMessageAsSeenParams } from "../../services/interface/Iuser";
import { IMessagesRepository } from "../interface/IUserRepositories";
import { BaseRepository } from "../baseRepository";

export class MessagesRepository extends BaseRepository<
    Message,
    Prisma.MessageWhereUniqueInput,
    Prisma.MessageWhereInput,
    Prisma.MessageOrderByWithRelationInput,
    Prisma.MessageCreateInput,
    Prisma.MessageUpdateInput,
    Prisma.MessageSelect,
    Prisma.MessageInclude
> implements IMessagesRepository {
    protected model = prisma.message as any;
    async createMessage(params: CreateMessageParams): Promise<any> {
        return await this.create(
            {
                body: params.message,
                image: params.image ?? undefined,
                conversation: { connect: { id: params.conversationId } },
                sender: { connect: { id: params.senderId } },
                seen: { connect: { id: params.senderId } },
            } as Prisma.MessageCreateInput,
            { include: { seen: true, sender: true } as any }
        );
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