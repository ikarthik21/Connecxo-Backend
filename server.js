import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/Authroutes.js';
import userRoutes from './routes/Userroutes.js';


dotenv.config();
const app = express();
const port = process.env.PORT || 3100;


app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/user', userRoutes);


app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});





