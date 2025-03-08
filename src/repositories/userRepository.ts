import { UserRepository } from "./interface/IUserRepository";
import prisma from "../libs/prismadb";
import { User, Listing } from "@prisma/client";
import bcrypt from "bcrypt";
import {
    CreateListingParams,
    CreateReservationParams,
    MarkMessageAsSeenParams,
    CreateMessageParams,
    FilterListingsParams,
    DeleteNotificationParams,
    GetNotificationsParams,
    CreateNotificationParams,
    WalletUpdateParams,
    CreateReviewParams,
    UpdateReviewParams,
    DeleteReviewParams,
    GetReviewsParams,
    UpdateOfferPriceParams,
} from "../services/interface/Iuser";

export class UserRepositoryImplementation implements UserRepository {
    // Add a listing to the user's favorites
    async addFavorite(userId: string, listingId: string): Promise<User> {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { favoriteIds: { push: listingId } },
        });
        return user;
    }

    // Remove a listing from the user's favorites
    async removeFavorite(userId: string, listingId: string): Promise<User> {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                favoriteIds: {
                    set: (
                        await prisma.user.findUnique({ where: { id: userId } })
                    )?.favoriteIds.filter((id) => id !== listingId),
                },
            },
        });
        return user;
    }
    async getListingsByCategory(params: FilterListingsParams): Promise<any> {
        return await prisma.listing.findMany({
            where: {
                category: params.category,
            },
        });
    }
    async createListing(data: CreateListingParams): Promise<Listing> {
        return await prisma.listing.create({
            data: {
                title: data.title,
                description: data.description,
                imageSrc: data.imageSrc,
                category: data.category,
                roomCount: data.roomCount,
                guestCount: data.guestCount,
                locationValues: data.locationValues,
                price: data.price,
                userId: data.userId,
            },
        });
    }

    async createReservation(data: CreateReservationParams): Promise<any> {
        return await prisma.reservation.create({ data });
    }
    async createMessage(params: CreateMessageParams): Promise<any> {
        return await prisma.message.create({
            data: {
                body: params.message,
                image: params.image,
                conversation: {
                    connect: { id: params.conversationId },
                },
                sender: {
                    connect: { id: params.senderId },
                },
                seen: {
                    connect: { id: params.senderId },
                },
            },
            include: {
                seen: true,
                sender: true,
            },
        });
    }

    async updateConversationLastMessage(conversationId: string, messageId: string): Promise<any> {
        return await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: { id: messageId },
                },
            },
            include: {
                users: true,
                messages: { include: { seen: true } },
            },
        });
    }

    async markMessageAsSeen(params: MarkMessageAsSeenParams): Promise<any> {
        const { conversationId, userId } = params;

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                messages: { include: { seen: true } },
                users: true,
            },
        });

        if (!conversation) throw new Error("Invalid conversation ID");

        const lastMessage = conversation.messages[conversation.messages.length - 1];
        if (!lastMessage) return conversation;

        return await prisma.message.update({
            where: { id: lastMessage.id },
            data: {
                seen: { connect: { id: userId } },
            },
            include: { sender: true, seen: true },
        });
    }

    //profile
    async findByEmail(email: string): Promise<User | null> {
        console.log("Finding user with email:", email); // Debug log
        const getUser = await prisma.user.findUnique({
            where: { email },
        });
        console.log("User found:", getUser); // Debug log
        return getUser;
    }

    //change password
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<User> {
        if (!userId || !currentPassword || !newPassword) {
            throw new Error("User ID, current password, and new password are required.");
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error("User not found.");
        }

        const isCorrectPassword = await bcrypt.compare(currentPassword, user.hashedPassword ?? "");

        if (!isCorrectPassword) {
            throw new Error("Incorrect current password.");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { hashedPassword },
        });

        return updatedUser;
    }
    //handle listing
    async findById(id: string): Promise<(Listing & { user: User | null }) | null> {
        try {
            const listing = await prisma.listing.findUnique({
                where: { id },
                include: { user: true },
            });

            if (!listing) {
                return null;
            }

            return {
                ...listing,
                createdAt: listing.createdAt,
                user: listing.user
                    ? {
                          ...listing.user,
                          createdAt: listing.user.createdAt,
                          updatedAt: listing.user.updatedAt,
                          emailVerified: listing.user.emailVerified,
                      }
                    : null,
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async create(data: any): Promise<Listing> {
        try {
            return await prisma.listing.create({
                data: {
                    title: data.title,
                    description: data.description,
                    imageSrc: data.imageSrc,
                    category: data.category,
                    roomCount: data.roomCount,
                    guestCount: data.guestCount,
                    locationValues: data.location.value,
                    price: parseInt(data.price, 10),
                    userId: data.userId,
                },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    async updateProfileImage(userId: string, imageUrl: string): Promise<User> {
        return await prisma.user.update({
            where: { id: userId },
            data: { image: imageUrl },
        });
    }

    async updateAbout(userId: string, about: string): Promise<User> {
        return await prisma.user.update({
            where: { id: userId },
            data: { about },
        });
    }
    async getNotificationCount(userId: string): Promise<number> {
        return await prisma.notification.count({
            where: { userId, isRead: false },
        });
    }
    async deleteNotification(params: DeleteNotificationParams): Promise<any> {
        return await prisma.notification.deleteMany({
            where: {
                id: params.notificationId,
                userId: params.userId,
            },
        });
    }
    async getNotifications(params: GetNotificationsParams): Promise<any> {
        return await prisma.notification.findMany({
            where: {
                userId: params.userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async createNotification(params: CreateNotificationParams): Promise<any> {
        return await prisma.notification.create({
            data: {
                userId: params.userId,
                message: params.message,
                type: params.type || "info",
            },
        });
    }
    async findReservationById(reservationId: string): Promise<any> {
        return await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: {
                listing: true,
                user: {
                    select: { email: true, id: true },
                },
            },
        });
    }

    async deleteReservation(reservationId: string): Promise<any> {
        return await prisma.reservation.delete({ where: { id: reservationId } });
    }

    async refundToWallet(params: WalletUpdateParams): Promise<any> {
        return await prisma.wallet.update({
            where: { userId: params.userId },
            data: {
                balance: { increment: params.amount },
            },
        });
    }

    async createCancelledReservation(params: any): Promise<any> {
        return await prisma.cancelledReservation.create({ data: params });
    }

    async createReview(params: CreateReviewParams): Promise<any> {
        return await prisma.review.create({
            data: {
                userId: params.userId,
                listingId: params.listingId,
                reservationId: params.reservationId,
                rating: params.rating,
                title: params.title,
                content: params.content,
                verified: true,
            },
        });
    }

    async updateReview(params: UpdateReviewParams): Promise<any> {
        return await prisma.review.update({
            where: { id: params.reviewId },
            data: {
                rating: params.rating,
                title: params.title,
                content: params.content,
            },
        });
    }

    async deleteReview(params: DeleteReviewParams): Promise<any> {
        return await prisma.review.delete({
            where: {
                id: params.reviewId,
                userId: params.userId, // Ensure user can only delete their own review
            },
        });
    }

    async getReviews(params: GetReviewsParams): Promise<any> {
        const reviews = await prisma.review.findMany({
            where: { listingId: params.listingId },
            include: { user: true },
            orderBy: { createdAt: "desc" },
        });

        return reviews.map((review) => ({
            id: review.id,
            author: review.user.name || "Anonymous",
            date: review.createdAt.toISOString(),
            rating: review.rating,
            title: review.title,
            content: review.content,
            helpfulCount: review.helpfulCount,
            verified: review.verified,
            userId: review.userId,
        }));
    }

    async findReviewById(reviewId: string): Promise<any> {
        return await prisma.review.findUnique({ where: { id: reviewId } });
    }
    async updateOfferPrice(params: UpdateOfferPriceParams): Promise<any> {
        return await prisma.listing.updateMany({
            where: {
                id: params.listingId,
                userId: params.userId,
            },
            data: {
                offerPrice: params.offerPrice,
            },
        });
    }
}
