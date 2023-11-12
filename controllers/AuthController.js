import { getPrismaInstance } from '../utils/PrismaUtils.js';
import crypto from 'crypto';
import { generateToken04 } from '../utils/TokenUtils.js';
import dotenv from 'dotenv';
import { log } from 'console';
dotenv.config();

function generateId() {
    const randomBytes = crypto.randomBytes(16);
    const id = randomBytes.toString('hex');
    return id;
}

export const userValidate = async (req, res, next) => {

    try {

        const { email, name } = req.body;

        if (!email) {
            return res.json({ message: "Email is required" }, { status: false })
        }

        const prisma = await getPrismaInstance();

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {

            const id = generateId();
            const user = await prisma.user.create({
                data: {
                    id: id,
                    email: email,
                    display_name: name,
                    profileImg: "/images/user.jpg"
                },
            });

            return res.json({ message: "user found", status: true, data: user });

        }

        return res.json({ message: "user found", status: true, data: user });
    }
    catch (error) {
        console.log(error);
        next(error);
    }

}


export const getUserId = async (req, res, next) => {

    try {
        const { email } = req.body;
        const prisma = await getPrismaInstance();
        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            return res.json({ user });
        }

        return res.json({ message: 'No User Found' });

    }
    catch (error) {
        console.log(error);
        next(error);
    }
}



export const generateToken = (req, res, next) => {
    try {

        const appId = parseInt(process.env.ZEGO_APP_ID);
        const serverSecret = process.env.ZEGO_SERVER_SECRET;
        const time = 3600;
        const payload = "";
        const userId = req.params.userId.toString();

        if (appId && serverSecret && userId) {
            const token = generateToken04(appId, userId, serverSecret, time, payload);
            res.status(200).json({ token });
        }

        // res.status(400).send("UserId , AppId are required");
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}