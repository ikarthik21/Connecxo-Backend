import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/Authroutes.js';
import userRoutes from './routes/Userroutes.js';
import messageRoutes from './routes/Messageroutes.js';
import { Server } from 'socket.io';
dotenv.config();
const app = express();
const port = process.env.PORT || 3100;


app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.use('/user', userRoutes);
app.get('/', (req, res) => {
    res.end("<h1>Welcome  to Connecxo Backend</h1>")
})

const server = app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});


const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL
    }
})

global.onlineUsers = new Map();

io.on('connection', socket => {
    global.chatSocket = socket;
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id)
    });

    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            const now = new Date();
            const formattedDate = now.toISOString();
            const sendData = {
                senderId: data.from,
                receiverId: data.to,
                type: data.type,
                message: data.message,
                messageStatus: "delivered",
                createdAt: formattedDate
            }

            socket.to(sendUserSocket).emit('msg-receive', sendData)
        }
    })

    socket.on('init-call', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('receive-call', data)
        }
    })

    socket.on('end-call', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('close-call', data)
        }
    })

    // cancel call by self by user
    socket.on('cancel-call', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('close-incoming-call', data)
        }
    })
})


const keepAliveInterval = 10 * 60 * 1000;
setInterval(() => {
    console.log('Server is alive and well!');
}, keepAliveInterval);