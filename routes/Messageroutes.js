
import { Router } from 'express';
import { addMessage, getMessages, getInitialMessages } from '../controllers/MessageController.js';

const messageRoutes = Router();


messageRoutes.post('/add-message', addMessage)

messageRoutes.get('/get-messages/:from/:to', getMessages);


messageRoutes.get('/getintialmsgs/:from', getInitialMessages);



export default messageRoutes;