import { Router } from 'express';
import { getProfile, updateProfile, getAllUsers } from '../controllers/user/UserController.js';

const userRoutes = Router();
   
userRoutes.get('/profile/:userId', getProfile);
userRoutes.get('/all', getAllUsers);

userRoutes.patch('/profile/update', updateProfile);


export default userRoutes;
