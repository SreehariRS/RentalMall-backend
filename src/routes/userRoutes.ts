
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
router.route("/favorites")
    .post(async (req: Request, res: Response) => {
        await favoritesController.addFavorite(req, res);
    })
    .delete(async (req: Request, res: Response) => {
        await favoritesController.removeFavorite(req, res);
    });

// Profile routes
router.route("/get-profile").get(verifyUser, async (req: Request, res: Response) => {
    await profileController.getProfile(req, res);
});
router.route("/update-profile-image").post(verifyUser, async (req: Request, res: Response) => {
    await profileController.updateProfileImage(req, res);
});
router.route("/update-about").post(verifyUser, async (req: Request, res: Response) => {
    await profileController.updateAbout(req, res);
});

// Password routes
router.route("/change-password").post(verifyUser, async (req: Request, res: Response) => {
    await passwordController.changePassword(req, res);
});

// Listings routes
router.route("/listings").get(async (req: Request, res: Response) => {
    await listingsController.getListingsByCategory(req, res);
});
router.route("/:listingId").get(async (req: Request, res: Response) => {
    await listingsController.getListingById(req, res);
});
router.route("/listings").post(verifyUser, async (req: Request, res: Response) => {
    await listingsController.createListing(req, res);
});

// Reservations routes
router.route("/reservation").post(verifyUser, async (req: Request, res: Response) => {
    await reservationsController.createReservation(req, res);
});
router.route("/reservations/:reservationId").delete(verifyUser, async (req: Request, res: Response) => {
    await reservationsController.cancelReservation(req, res);
});

// Messages routes
router.route("/messages").post(verifyUser, async (req: Request, res: Response) => {
    await messagesController.createMessage(req, res);
});
router.route("/messages/seen/:conversationId").post(verifyUser, async (req: Request, res: Response) => {
    await messagesController.markMessageAsSeen(req, res);
});
router.post("/conversations/:conversationId/messages", verifyUser, async (req: Request, res: Response) => {
    await messagesController.createMessage(req, res);
});

// Notifications routes
router.route("/notification-count").get(verifyUser, async (req: Request, res: Response) => {
    await notificationsController.getNotificationCount(req, res);
});
router.route("/notifications/:notificationId").delete(verifyUser, async (req: Request, res: Response) => {
    await notificationsController.deleteNotification(req, res);
});
router.route("/notifications").get(verifyUser, async (req: Request, res: Response) => {
    await notificationsController.getNotifications(req, res);
});
router.route("/notifications").post(verifyUser, async (req: Request, res: Response) => {
    await notificationsController.createNotification(req, res);
});

// Reviews routes
router.route("/reviews").post(verifyUser, async (req: Request, res: Response) => {
    await reviewsController.createReview(req, res);
});
router.route("/reviews/:reviewId").put(verifyUser, async (req: Request, res: Response) => {
    await reviewsController.updateReview(req, res);
});
router.route("/reviews/:reviewId").delete(verifyUser, async (req: Request, res: Response) => {
    await reviewsController.deleteReview(req, res);
});
router.route("/reviews/:listingId").get(async (req: Request, res: Response) => {
    await reviewsController.getReviews(req, res);
});

// Offer routes
router.route("/listings/:listingId/offer").put(verifyUser, async (req: Request, res: Response) => {
    await offerController.updateOfferPrice(req, res);
});

// Payment routes
router.route("/order").post(async (req: Request, res: Response) => {
    await paymentController.createOrder(req, res);
});

export default router;