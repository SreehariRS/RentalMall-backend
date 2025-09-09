import { BaseRepository } from "../baseRepository";
import { Prisma, Notification as PrismaNotification } from "@prisma/client";
import prismaInstance from "../../libs/prismadb";
import { INotificationRepository } from "../interface/IadminRepositories";

export default class NotificationRepository extends BaseRepository<
  PrismaNotification,
  Prisma.NotificationWhereUniqueInput,
  Prisma.NotificationWhereInput,
  Prisma.NotificationOrderByWithRelationInput,
  Prisma.NotificationCreateInput,
  Prisma.NotificationUpdateInput,
  Prisma.NotificationSelect,
  undefined // Use undefined if no relations, or Prisma.NotificationInclude if relations exist
> implements INotificationRepository {
  protected model = prismaInstance.notification;

  async createNotification(userId: string, message: string, type: string): Promise<void> {
    try {
      await this.prisma.notification.create({
        data: {
          userId,
          message,
          type,
        },
      });
    } catch (error) {
      this.handleError(error, "createNotification");
    }
  }
}