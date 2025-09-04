import { Request, Response } from "express";
import { IMessagesService } from "../../services/interface/Iuser";
import { IMessagesController } from "../interface/IuserController";
import { HttpStatusCodes } from "../../config/HttpStatusCodes";
import { Messages } from "../../config/message";
import { pusherServer } from "../../libs/pusher";

export class MessagesController implements IMessagesController {
    private _messagesService: IMessagesService;

    constructor(messagesService: IMessagesService) {
        this._messagesService = messagesService;
    }

    async createMessage(req: Request, res: Response): Promise<Response> {
        try {
            const { message, image, conversationId } = req.body;
            const currentUser = (req as any).user;
            if (!currentUser?.id || !currentUser?.email) {
                return res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
            }
            const newMessage = await this._messagesService.createMessage({
                message,
                image,
                conversationId,
                senderId: currentUser.id,
            });
            const updatedConversation = await this._messagesService.updateConversationLastMessage(
                conversationId,
                newMessage.id
            );
            await pusherServer.trigger(conversationId, "messages:new", newMessage);
            const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];
            updatedConversation.users.map((user: { email: string | string[] }) => {
                pusherServer.trigger(user.email!, "conversation:update", {
                    id: conversationId,
                    messages: [lastMessage],
                });
            });
            return res.status(HttpStatusCodes.OK).json(newMessage);
        } catch (error) {
            console.error("Error creating message:", error);
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR });
        }
    }

    async markMessageAsSeen(req: Request, res: Response): Promise<Response> {
        try {
            const { conversationId } = req.params;
            const currentUser = (req as any).user;
            if (!currentUser?.id || !currentUser?.email) {
                return res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
            }
            const updatedMessage = await this._messagesService.markMessageAsSeen({
                conversationId,
                userId: currentUser.id,
                userEmail: currentUser.email,
            });
            await pusherServer.trigger(currentUser.email, "conversation:update", {
                id: conversationId,
                message: [updatedMessage],
            });
            await pusherServer.trigger(conversationId, "message:update", updatedMessage);
            return res.status(HttpStatusCodes.OK).json(updatedMessage);
        } catch (error) {
            console.error("Error marking message as seen:", error);
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR });
        }
    }
}