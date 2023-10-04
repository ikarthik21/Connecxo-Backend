import { getPrismaInstance } from '../../utils/PrismaUtils.js';


export const getProfile = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const prisma = await getPrismaInstance();
        const user = await prisma.user.findUnique({ where: { id: userId } });
        return res.json(user);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const getAllUsers = async (req, res, next) => {
    
    try {
        const prisma = await getPrismaInstance();
        const user = await prisma.user.findMany();

        return res.json(user);
    } catch (error) {
        console.log(error);
        next(error);
    }
}



export const updateProfile = async (req, res, next) => {

    try {
        const user = req.body;
        const prisma = await getPrismaInstance();
        await prisma.user.update({
            where: { id: user.id },
            data: user,
        });
        return res.json({ message: "Details Updated", status: true });
    } catch (error) {
        console.log(error);
        next(error);
    }

}
