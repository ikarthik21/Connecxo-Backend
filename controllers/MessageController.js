import { getPrismaInstance } from '../utils/PrismaUtils.js';

export const addMessage = async (req, res, next) => {
    try {
        const { message, from, to } = req.body;
        const prisma = getPrismaInstance();
        const getUser = onlineUsers.get(to);
        if (message && from && to) {
            const newMessage = await prisma.messages.create({
                data: {
                    message,
                    sender: { connect: { id: from } },
                    receiver: { connect: { id: to } },
                    messageStatus: getUser ? "delivered" : "sent"
                },
                include: { sender: true, receiver: true }
            });
            return res.status(201).send({ message: newMessage });
        }
        return res.status(400).send({ message: "All details are required" });
    }
    catch (error) {
        console.log(error);
        next(error);
    }

}




export const getMessages = async (req, res, next) => {


    try {
        const prisma = getPrismaInstance();
        const { from, to } = req.params;


        const messages = await prisma.messages.findMany({
            where: {
                OR: [
                    {
                        senderId: from,
                        receiverId: to
                    }
                    , {
                        senderId: to,
                        receiverId: from
                    }
                ]
            }, orderBy: {
                id: "asc"
            }

        })


        const unreadMessages = [];

        messages.forEach((message, index) => {

            if (message.messageStatus !== 'read' && message.senderId === to) {
                messages[index].messageStatus = 'read';
                unreadMessages.push(message.id);
            }
        });
        
       
        await prisma.messages.updateMany({
            where: {
                id: { in: unreadMessages }
            }, data: {
                messageStatus: 'read'
            }
        })


        return res.status(200).json({ messages });

    }
    catch (error) {
        console.log(error);
        next(error);
    }




}


