import express, { Request, Response } from "express";
import { FavoritesController } from "../controller/user/favoritesController";
import { ProfileController } from "../controller/user/profileController";
import { PasswordController } from "../controller/user/passwordController";
import { ListingsController } from "../controller/user/listingsController";
import { ReservationsController } from "../controller/user/reservationsController";
import { MessagesController } from "../controller/user/messagesController";
import { NotificationsController } from "../controller/user/notificationsController";
import { ReviewsController } from "../controller/user/reviewsController";
import { OfferController } from "../controller/user/offerController";
import { PaymentController } from "../controller/user/paymentController";
import { FavoritesService } from "../services/user/favoritesService";
import { ProfileService } from "../services/user/profileService";
import { PasswordService } from "../services/user/passwordService";
import { ListingsService } from "../services/user/listingsService";
import { ReservationsService } from "../services/user/reservationsService";
import { MessagesService } from "../services/user/messagesService";
import { NotificationsService } from "../services/user/notificationsService";
import { ReviewsService } from "../services/user/reviewsService";
import { OfferService } from "../services/user/offerService";
import { PaymentService } from "../services/user/paymentService";
import { FavoritesRepository } from "../repositories/user/favoritesRepository";
import { ProfileRepository } from "../repositories/user/profileRepository";
import { PasswordRepository } from "../repositories/user/passwordRepository";
import { ListingsRepository } from "../repositories/user/listingsRepository";
import { ReservationsRepository } from "../repositories/user/reservationsRepository";
import { MessagesRepository } from "../repositories/user/messagesRepository";
import { NotificationsRepository } from "../repositories/user/notificationsRepository";
import { ReviewsRepository } from "../repositories/user/reviewsRepository";
import { OfferRepository } from "../repositories/user/offerRepository";
import { PaymentRepository } from "../repositories/user/paymentRepository";
import verifyUser from "../middleware/verifyUser";
import { IFavoritesRepository, IListingsRepository, IMessagesRepository, INotificationsRepository, IOfferRepository, IPasswordRepository, IPaymentRepository, IProfileRepository, IReservationsRepository, IReviewsRepository } from "../repositories/interface/IUserRepositories";
import { IFavoritesService, IListingsService, IMessagesService, INotificationsService, IOfferService, IPasswordService, IPaymentService, IProfileService, IReservationsService, IReviewsService } from "../services/interface/Iuser";
import { USER_ROUTES } from "../config/routes";

const router = express.Router();

// Initialize repositories
const favoritesRepository: IFavoritesRepository = new FavoritesRepository();
const profileRepository: IProfileRepository = new ProfileRepository();
const passwordRepository: IPasswordRepository = new PasswordRepository();
const listingsRepository: IListingsRepository = new ListingsRepository();
const reservationsRepository: IReservationsRepository = new ReservationsRepository();
const messagesRepository: IMessagesRepository = new MessagesRepository();
const notificationsRepository: INotificationsRepository = new NotificationsRepository();
const reviewsRepository: IReviewsRepository = new ReviewsRepository();
const offerRepository: IOfferRepository = new OfferRepository();
const paymentRepository: IPaymentRepository = new PaymentRepository();

// Initialize services with repository interfaces
const favoritesService: IFavoritesService = new FavoritesService(favoritesRepository);
const profileService: IProfileService = new ProfileService(profileRepository);
const passwordService: IPasswordService = new PasswordService(passwordRepository);
const listingsService: IListingsService = new ListingsService(listingsRepository);
const reservationsService: IReservationsService = new ReservationsService(reservationsRepository);
const messagesService: IMessagesService = new MessagesService(messagesRepository);
const notificationsService: INotificationsService = new NotificationsService(notificationsRepository);
const reviewsService: IReviewsService = new ReviewsService(reviewsRepository);
const offerService: IOfferService = new OfferService(offerRepository);
const paymentService: IPaymentService = new PaymentService(paymentRepository);

// Initialize controllers with service interfaces
const favoritesController = new FavoritesController(favoritesService);
const profileController = new ProfileController(profileService);
const passwordController = new PasswordController(passwordService);
const listingsController = new ListingsController(listingsService);
const reservationsController = new ReservationsController(reservationsService);
const messagesController = new MessagesController(messagesService);
const notificationsController = new NotificationsController(notificationsService);
const reviewsController = new ReviewsController(reviewsService);
const offerController = new OfferController(offerService);
const paymentController = new PaymentController(paymentService);

// Favorites routes
router.route(USER_ROUTES.FAVORITES)
    .post(async (req: Request, res: Response) => {
        await favoritesController.addFavorite(req, res);
    })
    .delete(async (req: Request, res: Response) => {
        await favoritesController.removeFavorite(req, res);
    });

// Profile routes
router.route(USER_ROUTES.GET_PROFILE).get(verifyUser, async (req: Request, res: Response) => {
    await profileController.getProfile(req, res);
});
router.route(USER_ROUTES.UPDATE_PROFILE_IMAGE).post(verifyUser, async (req: Request, res: Response) => {
    await profileController.updateProfileImage(req, res);
});
router.route(USER_ROUTES.UPDATE_ABOUT).post(verifyUser, async (req: Request, res: Response) => {
    await profileController.updateAbout(req, res);
});

// Password routes
router.route(USER_ROUTES.CHANGE_PASSWORD).post(verifyUser, async (req: Request, res: Response) => {
    await passwordController.changePassword(req, res);
});
router.post(USER_ROUTES.FORGOT_PASSWORD, async (req: Request, res: Response) => {
    await passwordController.forgotPassword(req, res);
});
router.post(USER_ROUTES.RESET_PASSWORD, async (req: Request, res: Response) => {
    await passwordController.resetPassword(req, res);
});

// Listings routes
router.route(USER_ROUTES.LISTINGS).get(async (req: Request, res: Response) => {
    await listingsController.getListingsByCategory(req, res);
});
router.route(USER_ROUTES.LISTING_BY_ID).get(async (req: Request, res: Response) => {
    await listingsController.getListingById(req, res);
});
router.route(USER_ROUTES.LISTINGS).post(verifyUser, async (req: Request, res: Response) => {
    await listingsController.createListing(req, res);
});
router.put(USER_ROUTES.UPDATE_LISTING_PRICE, verifyUser, async (req: Request, res: Response) => {
    await listingsController.updatePrice(req, res);
});
router.delete(USER_ROUTES.DELETE_LISTING, verifyUser, async (req: Request, res: Response) => {
    await listingsController.deleteListing(req, res);
});
router.put(USER_ROUTES.UPDATE_LISTING, verifyUser, async (req: Request, res: Response) => {
    await listingsController.updateListing(req, res);
});

// Reservations routes
router.route(USER_ROUTES.CREATE_RESERVATION).post(verifyUser, async (req: Request, res: Response) => {
    await reservationsController.createReservation(req, res);
});
router.route(USER_ROUTES.CANCEL_RESERVATION).delete(verifyUser, async (req: Request, res: Response) => {
    await reservationsController.cancelReservation(req, res);
});

// Messages routes
router.route(USER_ROUTES.MESSAGES).post(verifyUser, async (req: Request, res: Response) => {
    await messagesController.createMessage(req, res);
});
router.route(USER_ROUTES.MARK_MESSAGE_SEEN).post(verifyUser, async (req: Request, res: Response) => {
    await messagesController.markMessageAsSeen(req, res);
});
router.post(USER_ROUTES.CONVERSATION_MESSAGES, verifyUser, async (req: Request, res: Response) => {
    await messagesController.createMessage(req, res);
});

// Notifications routes
router.route(USER_ROUTES.NOTIFICATION_COUNT).get(verifyUser, async (req: Request, res: Response) => {
    await notificationsController.getNotificationCount(req, res);
});
router.route(USER_ROUTES.DELETE_NOTIFICATION).delete(verifyUser, async (req: Request, res: Response) => {
    await notificationsController.deleteNotification(req, res);
});
router.route(USER_ROUTES.NOTIFICATIONS).get(verifyUser, async (req: Request, res: Response) => {
    await notificationsController.getNotifications(req, res);
});
router.route(USER_ROUTES.NOTIFICATIONS).post(verifyUser, async (req: Request, res: Response) => {
    await notificationsController.createNotification(req, res);
});

// Reviews routes
router.route(USER_ROUTES.REVIEWS).post(verifyUser, async (req: Request, res: Response) => {
    await reviewsController.createReview(req, res);
});
router.route(USER_ROUTES.UPDATE_REVIEW).put(verifyUser, async (req: Request, res: Response) => {
    await reviewsController.updateReview(req, res);
});
router.route(USER_ROUTES.DELETE_REVIEW).delete(verifyUser, async (req: Request, res: Response) => {
    await reviewsController.deleteReview(req, res);
});
router.route(USER_ROUTES.GET_REVIEWS).get(async (req: Request, res: Response) => {
    await reviewsController.getReviews(req, res);
});

// Offer routes
router.route(USER_ROUTES.UPDATE_OFFER_PRICE).put(verifyUser, async (req: Request, res: Response) => {
    await offerController.updateOfferPrice(req, res);
});

// Payment routes
router.route(USER_ROUTES.CREATE_ORDER).post(async (req: Request, res: Response) => {
    await paymentController.createOrder(req, res);
});

export default router;