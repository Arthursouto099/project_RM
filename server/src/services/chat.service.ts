import prisma from "../prisma.config"
import ChatErrorHandler from "../errors/ChatErrorHandler"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"




const chatService = {




    // criando um chat privado para dois usuarios
    createOrReturnPrivateChat: async (UserA: string, UserB: string) => {


        try {
            const existingChat = await prisma.chat.findFirst({
                where: {
                    // como é privado o isGroup é false
                    isGroup: false,
                    // procuro todos os chats onde temos participante A && B
                    AND: [
                        { participants: { some: { id_user: UserA } } },
                        // verifico os chats onde temos o usuario A
                        { participants: { some: { id_user: UserA } } },
                        // verifico os chats onde temos o usuario B
                        // verifico se em participantes <every caso todas as condições seja, certa>
                        // Verifico se em participantes existe os ids 
                        { participants: { every: { id_user: { in: [UserA, UserB] } } } }
                    ]
                },
                include: { participants: true, messages: true }
            })

            if (existingChat) return {
                data: existingChat,
                message: "Chat Encontrado com sucesso"
            }  


            return {
                data: await prisma.chat.create({
                data: {
                    isGroup: false,
                    participants: {
                        create: [
                            { id_user: UserA },
                            { id_user: UserB }
                        ]
                    }
                }
            }) ,
            message: "Chat criado com sucesso"
            } 

        }
        catch (e) {

            if (e instanceof ChatErrorHandler) throw e

            if (e instanceof PrismaClientKnownRequestError) throw ChatErrorHandler.internal(e.message)

            throw ChatErrorHandler.internal()

        }



    },



    getPrivateMessas: async  ( id_chat: string  , {page = 1, limit = 20}) => {
        const skip = (page - 1) * limit
        const messages = await prisma.message.findMany({where: {id_chat}, take: limit, skip: skip, orderBy: {createdAt: "desc"}, include: {sender: true}} ,)
        return messages ?? []
    },


    SendMessage: async ({ id_chat, id_sender, content, images, videos }: {
        id_chat: string,
        id_sender: string,
        content: string,
        images?: string[],
        videos?: string[]
    }) => {

        try {
            const message = await prisma.message.create({
                data: {
                    id_chat,
                    id_sender,
                    content,
                    images: images ?? [],
                    videos: videos ?? []
                }
                ,include: {sender: true}
            })


            return message
        }
        catch (e) {
            console.log(e)

            if (e instanceof ChatErrorHandler) throw e

            if (e instanceof PrismaClientKnownRequestError) throw ChatErrorHandler.internal(e.message)

            throw ChatErrorHandler.internal()

        }
    }


}


export default chatService