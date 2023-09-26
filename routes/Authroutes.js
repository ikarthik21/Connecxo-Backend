import { userValidate, getUserId } from '../controllers/AuthController.js';

import { Router } from 'express';

const authRoutes = Router();


authRoutes.post('/check-user', userValidate);


authRoutes.post('/userId', getUserId);


 
export default authRoutes;