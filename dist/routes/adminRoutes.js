"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controller/adminController");
const adminRepositoryImplimentation_1 = require("../repositories/adminRepositoryImplimentation");
const adminService_1 = __importDefault(require("../services/adminService"));
const router = express_1.default.Router();
const adminRepositoryImplementation = new adminRepositoryImplimentation_1.AdminRepositoryImplementation();
const adminService = new adminService_1.default(adminRepositoryImplementation);
const adminController = new adminController_1.AdminController(adminService);
router.post('/', (req, res) => adminController.login(req, res));
router.get('/users', (req, res) => adminController.getAllUsers(req, res));
// Block user route
router.patch('/users/:userId/block', (req, res) => adminController.blockUser(req, res));
// Unblock user route
router.patch('/users/:userId/unblock', (req, res) => adminController.unblockUser(req, res));
exports.default = router;
