import express from "express";
import { AuthController } from "../controller/admin/authController";
import { UserController } from "../controller/admin/userController";
import { ReservationController } from "../controller/admin/reservationController";
import { HostController } from "../controller/admin/hostController";
import { DashboardController } from "../controller/admin/dashboardController";
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

const router = express.Router();

const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const reservationRepository = new ReservationRepository();
const hostRepository = new HostRepository();
const dashboardRepository = new DashboardRepository();

const authService = new AuthService(authRepository);
const userService = new UserService(userRepository);
const reservationService = new ReservationService(reservationRepository);
const hostService = new HostService(hostRepository);
const dashboardService = new DashboardService(dashboardRepository);

const authController = new AuthController(authService);
const userController = new UserController(userService);
const reservationController = new ReservationController(reservationService);
const hostController = new HostController(hostService);
const dashboardController = new DashboardController(dashboardService);

router.route("/").post(authController.login.bind(authController));
router.route("/users").get(userController.getAllUsers.bind(userController));
router.route("/users/:userId/block").patch(userController.blockUser.bind(userController));
router.route("/users/:userId/unblock").patch(userController.unblockUser.bind(userController));
router.route("/reservations").get(reservationController.getAllReservations.bind(reservationController));
router.route("/hosts").get(hostController.getAllHosts.bind(hostController));
router.route("/dashboard-stats").get(dashboardController.getDashboardStats.bind(dashboardController));

export default router;