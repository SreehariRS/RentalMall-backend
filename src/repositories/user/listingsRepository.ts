
import { Listing, Prisma, User } from "@prisma/client";
import prisma from "../../libs/prismadb";
import { CreateListingParams, FilterListingsParams } from "../../services/interface/Iuser";
import { ObjectId } from "mongodb";
import { IListingsRepository } from "../interface/IUserRepositories";
import { BaseRepository } from "../baseRepository";

export class ListingsRepository extends BaseRepository<
    Listing,
    Prisma.ListingWhereUniqueInput,
    Prisma.ListingWhereInput,
    Prisma.ListingOrderByWithRelationInput,
    Prisma.ListingCreateInput,
    Prisma.ListingUpdateInput,
    Prisma.ListingSelect,
    Prisma.ListingInclude
> implements IListingsRepository {
    protected model = prisma.listing as any;
    async getListingsByCategory(params: FilterListingsParams): Promise<Listing[]> {
        return await this.findMany({ where: { category: params.category } as any });
    }

    async findById(id: string): Promise<(Listing & { user: User | null }) | null> {
        console.log("Fetching listing with ID:", id);
        if (!ObjectId.isValid(id)) {
            throw new Error(`Invalid ID format: "${id}". Expected a valid MongoDB ObjectID.`);
        }
        const listing = await this.findUnique(
            { id },
            { include: { user: true } as any }
        );
        return listing
            ? {
                  ...(listing as any),
                  createdAt: (listing as any).createdAt,
                  user: (listing as any).user
                      ? {
                            ...(listing as any).user,
                            createdAt: (listing as any).user.createdAt,
                            updatedAt: (listing as any).user.updatedAt,
                            emailVerified: (listing as any).user.emailVerified,
                        }
                      : null,
              }
            : null;
    }

    async createListing(data: CreateListingParams): Promise<Listing> {
        return await this.create({
            title: data.title,
            description: data.description,
            imageSrc: data.imageSrc,
            category: data.category,
            roomCount: data.roomCount,
            guestCount: data.guestCount,
            locationValues: data.locationValues as any,
            price: data.price,
            user: { connect: { id: data.userId } },
        } as Prisma.ListingCreateInput);
    }
    async updatePrice(listingId: string, userId: string, price: number): Promise<{ count: number }> {
        return await prisma.listing.updateMany({
          where: { id: listingId, userId },
          data: { price },
        });
      }
    
      async findReservationsByListingId(listingId: string): Promise<any[]> {
        return await prisma.reservation.findMany({
          where: { listingId },
          include: { user: { select: { id: true, email: true } }, listing: true },
        });
      }
    
      async createNotification(params: any): Promise<any> {
        return await prisma.notification.create({ data: params });
      }
    
      async deleteListing(listingId: string, userId: string): Promise<{ count: number }> {
        return await prisma.listing.deleteMany({
          where: { id: listingId, userId },
        });
      }
    
      async updateListing(listingId: string, userId: string, data: any): Promise<{ count: number }> {
        return await prisma.listing.updateMany({
          where: { id: listingId, userId },
          data,
        });
      }
}