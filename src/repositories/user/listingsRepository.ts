// src/repositories/user/listingsRepository.ts

import { Listing, User } from "@prisma/client";
import prisma from "../../libs/prismadb";
import { CreateListingParams, FilterListingsParams } from "../../services/interface/Iuser";
import { ObjectId } from "mongodb";
import { IListingsRepository } from "../interface/IUserRepositories";

export class ListingsRepository implements IListingsRepository {
    async getListingsByCategory(params: FilterListingsParams): Promise<Listing[]> {
        return await prisma.listing.findMany({ where: { category: params.category } });
    }

    async findById(id: string): Promise<(Listing & { user: User | null }) | null> {
        console.log("Fetching listing with ID:", id);
        if (!ObjectId.isValid(id)) {
            throw new Error(`Invalid ID format: "${id}". Expected a valid MongoDB ObjectID.`);
        }
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: { user: true },
        });
        return listing
            ? {
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
              }
            : null;
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