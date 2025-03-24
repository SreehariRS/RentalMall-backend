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

const router = express.Router();

const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const reservationRepository = new ReservationRepository();
const hostRepository = new HostRepository();
const dashboardRepository = new DashboardRepository();
const notificationRepository = new NotificationRepository();

const authService = new AuthService(authRepository);
const userService = new UserService(userRepository);
const reservationService = new ReservationService(reservationRepository);
const hostService = new HostService(hostRepository);
const dashboardService = new DashboardService(dashboardRepository);
const notificationService = new NotificationService(notificationRepository);

const authController = new AuthController(authService);
const userController = new UserController(userService);
const reservationController = new ReservationController(reservationService);
const hostController = new HostController(hostService);
const dashboardController = new DashboardController(dashboardService);
const notificationController = new NotificationController(notificationService);

router.route("/").post(authController.login.bind(authController));
router.route("/refresh").post(authController.refresh.bind(authController));

// Protected routes
router.route("/users").get(protect, adminOnly, userController.getAllUsers.bind(userController));
router.route("/users/:userId/block").patch(protect, adminOnly, userController.blockUser.bind(userController));
router.route("/users/:userId/unblock").patch(protect, adminOnly, userController.unblockUser.bind(userController));
router.route("/users/:userId/restrict").patch(protect, adminOnly, userController.restrictHost.bind(userController));
router.route("/users/:userId/unrestrict").patch(protect, adminOnly, userController.unrestrictHost.bind(userController));
router.route("/reservations").get(protect, adminOnly, reservationController.getAllReservations.bind(reservationController));
router.route("/hosts").get(protect, adminOnly, hostController.getAllHosts.bind(hostController));
router.route("/notifications").post(protect, adminOnly, notificationController.sendNotification.bind(notificationController));
router.route("/dashboard-stats").get(protect, adminOnly, dashboardController.getDashboardStats.bind(dashboardController));

export default router;