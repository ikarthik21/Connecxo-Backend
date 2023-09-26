import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user/UserController.js';

const userRoutes = Router();

userRoutes.get('/profile/:userId', getProfile);

userRoutes.patch('/profile/update', updateProfile);


export default userRoutes;
