import { Request, Response } from "express";

export interface IFavoritesController {
    addFavorite(req: Request, res: Response): Promise<Response>;
    removeFavorite(req: Request, res: Response): Promise<Response>;
}

export interface IListingsController {
    getListingsByCategory(req: Request, res: Response): Promise<Response>;
    getListingById(req: Request, res: Response): Promise<Response>;
    createListing(req: Request, res: Response): Promise<Response>;
}

export interface IMessagesController {
    createMessage(req: Request, res: Response): Promise<Response>;
    markMessageAsSeen(req: Request, res: Response): Promise<Response>;
}

export interface INotificationsController {
    getNotificationCount(req: Request, res: Response): Promise<Response>;
    deleteNotification(req: Request, res: Response): Promise<Response>;
    getNotifications(req: Request, res: Response): Promise<Response>;
    createNotification(req: Request, res: Response): Promise<Response>;
}

export interface IOfferController {
    updateOfferPrice(req: Request, res: Response): Promise<Response>;
}

export interface IPasswordController {
    changePassword(req: Request, res: Response): Promise<Response>;
}

export interface IPaymentController {
    createOrder(req: Request, res: Response): Promise<void>;
}

export interface IProfileController {
    getProfile(req: Request, res: Response): Promise<Response>;
    updateProfileImage(req: Request, res: Response): Promise<Response>;
    updateAbout(req: Request, res: Response): Promise<Response>;
}

export interface IReservationsController {
    createReservation(req: Request, res: Response): Promise<Response>;
    cancelReservation(req: Request, res: Response): Promise<Response>;
}

export interface IReviewsController {
    createReview(req: Request, res: Response): Promise<Response>;
    updateReview(req: Request, res: Response): Promise<Response>;
    deleteReview(req: Request, res: Response): Promise<Response>;
    getReviews(req: Request, res: Response): Promise<Response>;
}
