import { Request, Response } from "express";
import { MessagesService } from "../../services/user/messagesService";
import { pusherServer } from "../../libs/pusher";

export class MessagesController {
    private messagesService: MessagesService;

    constructor(messagesService: MessagesService) {
        this.messagesService = messagesService;
    }

    async createMessage(req: Request, res: Response): Promise<Response> {
        try {
            const { message, image, conversationId } = req.body;
            const currentUser = (req as any).user;
            if (!currentUser?.id || !currentUser?.email) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const newMessage = await this.messagesService.createMessage({ message, image, conversationId, senderId: currentUser.id });
            const updatedConversation = await this.messagesService.updateConversationLastMessage(conversationId, newMessage.id);
            await pusherServer.trigger(conversationId, "messages:new", newMessage);
            const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];
            updatedConversation.users.map((user: { email: string | string[] }) => {
                pusherServer.trigger(user.email!, "conversation:update", { id: conversationId, messages: [lastMessage] });
            });
            return res.status(200).json(newMessage);
        } catch (error) {
            console.error("Error creating message:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async markMessageAsSeen(req: Request, res: Response): Promise<Response> {
        try {
            const { conversationId } = req.params;
            const currentUser = (req as any).user;
            if (!currentUser?.id || !currentUser?.email) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const updatedMessage = await this.messagesService.markMessageAsSeen({ conversationId, userId: currentUser.id, userEmail: currentUser.email });
            await pusherServer.trigger(currentUser.email, "conversation:update", { id: conversationId, message: [updatedMessage] });
            await pusherServer.trigger(conversationId, "message:update", updatedMessage);
            return res.status(200).json(updatedMessage);
        } catch (error) {
            console.error("Error marking message as seen:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}