import { getPrismaInstance } from '../utils/PrismaUtils.js';
import crypto from 'crypto';


function generateId() {
    const randomBytes = crypto.randomBytes(16);
    const id = randomBytes.toString('hex');
    return id;
}

export const userValidate = async (req, res, next) => {

    try {

        const { email } = req.body;

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