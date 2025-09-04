import express from "express";
import { AuthController } from "../controller/admin/authController";
import { UserController } from "../controller/admin/userController";
import { ReservationController } from "../controller/admin/reservationController";
import { HostController } from "../controller/admin/hostController";
import { DashboardController } from "../controller/admin/dashboardController";
import { protect, adminOnly } from "../middleware/authMiddleware";
import AuthService from "../services/admin/authService";
import UserService from "../services/admin/userService";
import ReservationService from "../services/admin/reservationService";
import HostService from "../services/admin/hostService";
import DashboardService from "../services/admin/dashboardService";
import AuthRepository from "../repositories/admin/authRepository";
import UserRepository from "../repositories/admin/userRepository";
import ReservationRepository from "../repositories/admin/reservationRepository";
import HostRepository from "../repositories/admin/hostRepository";
import DashboardRepository from "../repositories/admin/dashboardRepository";
import NotificationService from "../services/admin/notificationService";
import NotificationRepository from "../repositories/admin/notificationRepository";
import { NotificationController } from "../controller/admin/notificationController";
import { ADMIN_ROUTES } from "../config/routes";

const router = express.Router();

// Initialize repositories
const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const reservationRepository = new ReservationRepository();
const hostRepository = new HostRepository();
const dashboardRepository = new DashboardRepository();
const notificationRepository = new NotificationRepository();

// Initialize services
const authService = new AuthService(authRepository);
const userService = new UserService(userRepository);
const reservationService = new ReservationService(reservationRepository);
const hostService = new HostService(hostRepository);
const dashboardService = new DashboardService(dashboardRepository);
const notificationService = new NotificationService(notificationRepository);

// Initialize controllers
const authController = new AuthController(authService);
const userController = new UserController(userService);
const reservationController = new ReservationController(reservationService);
const hostController = new HostController(hostService);
const dashboardController = new DashboardController(dashboardService);
const notificationController = new NotificationController(notificationService);

// Auth routes
router.route(ADMIN_ROUTES.LOGIN).post(authController.login.bind(authController));
router.route(ADMIN_ROUTES.REFRESH).post(authController.refresh.bind(authController));

// Protected user management routes
router.route(ADMIN_ROUTES.USERS).get(protect, adminOnly, userController.getAllUsers.bind(userController));
router.route(ADMIN_ROUTES.BLOCK_USER).patch(protect, adminOnly, userController.blockUser.bind(userController));
router.route(ADMIN_ROUTES.UNBLOCK_USER).patch(protect, adminOnly, userController.unblockUser.bind(userController));
router.route(ADMIN_ROUTES.RESTRICT_USER).patch(protect, adminOnly, userController.restrictHost.bind(userController));
router.route(ADMIN_ROUTES.UNRESTRICT_USER).patch(protect, adminOnly, userController.unrestrictHost.bind(userController));

// Protected reservation routes
router.route(ADMIN_ROUTES.RESERVATIONS).get(protect, adminOnly, reservationController.getAllReservations.bind(reservationController));

// Protected host routes
router.route(ADMIN_ROUTES.HOSTS).get(protect, adminOnly, hostController.getAllHosts.bind(hostController));

// Protected notification routes
router.route(ADMIN_ROUTES.NOTIFICATIONS).post(protect, adminOnly, notificationController.sendNotification.bind(notificationController));

// Protected dashboard routes
router.route(ADMIN_ROUTES.DASHBOARD_STATS).get(protect, adminOnly, dashboardController.getDashboardStats.bind(dashboardController));

export default router;