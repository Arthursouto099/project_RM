import { Response, NextFunction } from "express";
import { responseOk } from "../config/responses/app.response";
import chatService from "../services/chat.service";
import { CustomRequest } from "../types/CustomRequest";
import ChatErrorHandler from "../errors/ChatErrorHandler";
import { io } from "../app";





const chatController = {

// vai receber o id do outro usuario pelo parametro
createPrivateChat: async (req: CustomRequest, res: Response, next: NextFunction) => {
    try{
        if(!req.userLogged) throw ChatErrorHandler.unauthorized()
        const createdChat = await chatService.createOrReturnPrivateChat(req.userLogged?.id_user, req.params.id_user)
        responseOk(res, createdChat.message, createdChat.data, 201)
    }
    catch(e) {
        next(e)
    }
},

findPrivateChat: async (req: CustomRequest, res: Response, next: NextFunction) => {
    try{
        if(!req.userLogged) throw ChatErrorHandler.unauthorized()
        const chat = await chatService.findChat(req.userLogged?.id_user, req.params.id_user)
        responseOk(res, chat.message, chat.data, 201)
    }
    catch(e) {
        next(e)
    }
},

sendMessage: async (req: CustomRequest, res: Response, next: NextFunction) => {
    try{
        if(!req.userLogged) throw ChatErrorHandler.unauthorized()
        req.body.id_sender = req.userLogged.id_user
        const sendMessage = await chatService.SendMessage(req.body)


        // aviso o IO quando uma nova mensagem e enviada para sala,
        // envio a mensagem nessa sala
        io.to(sendMessage.id_chat).emit("newMessage", sendMessage)


        responseOk(res, "Messagem enviada com sucesso!", sendMessage, 201)
    }
    catch(e) {
        next(e)
    }
},

getMessages: async (req: CustomRequest, res: Response, next: NextFunction) => {
    try{
        if(!req.userLogged) throw ChatErrorHandler.unauthorized()
        const sendMessage = await chatService.getPrivateMessas(req.params.id_chat, {page: Number(req.query.page ?? 1), limit: Number(req.query.limit ?? 20)})

        /*
        Estou definindo que ao receber a mensagem  eu emito para a minha sala IO 
        {IO DO APP} algumas informações  como o chatID e o timeStamp

        /*/
        io.to(req.params.id_chat).emit("chatViewed", {
            chatId: req.params.id_chat,
            timeStamp: new Date()
        })

        responseOk(res, "Mensagens encontradas com sucesso!", sendMessage, 200)
    }
    catch(e) {
        next(e)
    }
},







}




export default chatController