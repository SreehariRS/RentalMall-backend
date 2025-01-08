import express from 'express';
import { AdminController } from '../controller/adminController'; 
import { AdminRepositoryImplementation } from '../repositories/adminRepositoryImplimentation'; 
import AdminService from "../services/adminService";

const router = express.Router();

const adminRepositoryImplementation = new AdminRepositoryImplementation();
const adminService = new AdminService(adminRepositoryImplementation);
const adminController = new AdminController(adminService);

router.post('/', (req, res) => adminController.login(req, res));
router.get('/users', (req, res) => adminController.getAllUsers(req, res));
// Block user route
router.patch('/users/:userId/block', (req, res) => adminController.blockUser(req, res));

// Unblock user route
router.patch('/users/:userId/unblock', (req, res) => adminController.unblockUser(req, res));
export default router;
