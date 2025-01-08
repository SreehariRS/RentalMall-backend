import express, { Request, Response } from 'express';
import { UserController } from '../controller/userController'; 
import { UserService } from '../services/userService'; 
import { UserRepositoryImplementation } from '../repositories/userRepositoryImplementation'; 
import verifyUser from '../middleware/verifyUser';

const router = express.Router();

// Dependency Injection
const userRepositoryImplementation = new UserRepositoryImplementation();
const userService = new UserService(userRepositoryImplementation);
const userController = new UserController(userService);

// Routes
router.post('/favorites/add', async (req: Request, res: Response) => {
  await userController.addFavorite(req, res); 
});

router.delete('/favorites/remove', async (req: Request, res: Response) => {
  await userController.removeFavorite(req, res); 
});

// Profile route
router.get('/get-profile',verifyUser, async (req: Request, res: Response) => {
  try {
    await userController.getProfile(req, res);
  } catch (error) {
    console.error('Error in get-profile route:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
});

router.post('/change-password', verifyUser, async (req: Request, res: Response) => {
  await userController.changePassword(req, res);
});


export default router;
