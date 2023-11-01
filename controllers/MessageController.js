import { getPrismaInstance } from '../utils/PrismaUtils.js';

export const addMessage = async (req, res, next) => {
    try {
        const { message, from, to, type } = req.body;
        const prisma = getPrismaInstance();
        const getUser = onlineUsers.get(to);
        if (message && from && to) {
            const newMessage = await prisma.messages.create({
                data: {
                    message,
                    sender: { connect: { id: from } },
                    receiver: { connect: { id: to } },
                    type,
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

export const getInitialMessages = async (req, res, next) => {

    try {

        const userId = req.params.from;
        const prisma = await getPrismaInstance();

        const msgs = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                sentMessages: {
                    include: { receiver: true, sender: true },
                    orderBy: { createdAt: "desc" }
                },
                receivedMessages: {
                    include: { receiver: true, sender: true },
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        const messages = [...msgs.sentMessages, ...msgs.receivedMessages];
        messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        const users = new Map();
        const msgStatuschange = [];


        messages.forEach((msg) => {

            const isSender = msg.senderId === userId;
            const calcId = isSender ? msg.receiverId : msg.senderId;

            if (msg.messageStatus === "sent") {
                msgStatuschange.push(msg.id);
            }

            if (!users.get(calcId)) {

                const { id, type, message, messageStatus, createdAt, senderId, receiverId } = msg;


                let user = { messageId: id, type, message, messageStatus, createdAt, senderId, receiverId }

                if (isSender) {
                    user = {
                        ...user, ...msg.receiver,
                        totalUnreadMessages: 0,
                    }
                }
                else {
                    user = {
                        ...user, ...msg.sender,
                        totalUnreadMessages: messageStatus !== "read" ? 1 : 0,
                    }
                }
                users.set(calcId, { ...user });

            }
            else if (msg.messageStatus !== "read" && !isSender) {
                const user = users.get(calcId);
                users.set(calcId, {
                    ...user, totalUnreadMessages: user.totalUnreadMessages + 1
                })
            }

        }
        )

        await prisma.messages.updateMany({
            where: {
                id: { in: msgStatuschange }
            }, data: {
                messageStatus: 'delivered'
            }
        })


        return res.status(200).json({ users: Array.from(users.values()), onlineUsers: Array.from(onlineUsers.keys()) });

    }
    catch (error) {
        console.log(error);
        next(error);
    }

}


