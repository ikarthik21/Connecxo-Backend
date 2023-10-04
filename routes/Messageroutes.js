
import { Router } from 'express';
import { addMessage, getMessages } from '../controllers/MessageController.js';

const messageRoutes = Router();


messageRoutes.post('/add-message', addMessage)

messageRoutes.get('/get-messages/:from/:to', getMessages)

export default messageRoutes;