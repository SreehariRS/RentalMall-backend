"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const userService_1 = require("../services/userService");
const userRepositoryImplementation_1 = require("../repositories/userRepositoryImplementation");
const verifyUser_1 = __importDefault(require("../middleware/verifyUser"));
const router = express_1.default.Router();
// Dependency Injection
const userRepositoryImplementation = new userRepositoryImplementation_1.UserRepositoryImplementation();
const userService = new userService_1.UserService(userRepositoryImplementation);
const userController = new userController_1.UserController(userService);
// Routes
router.post('/favorites/add', async (req, res) => {
    await userController.addFavorite(req, res);
});
router.delete('/favorites/remove', async (req, res) => {
    await userController.removeFavorite(req, res);
});
// Profile route
router.get('/get-profile', verifyUser_1.default, async (req, res) => {
    try {
        await userController.getProfile(req, res);
    }
    catch (error) {
        console.error('Error in get-profile route:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
});
router.get('/dummy', verifyUser_1.default);
exports.default = router;
