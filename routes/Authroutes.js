import { userValidate, getUserId, generateToken } from '../controllers/AuthController.js';

import { Router } from 'express';

const authRoutes = Router();


authRoutes.post('/check-user', userValidate);


authRoutes.post('/userId', getUserId);

authRoutes.get('/zego/token/:userId', generateToken);


export default authRoutes;