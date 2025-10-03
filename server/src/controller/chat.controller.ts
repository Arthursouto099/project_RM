import { Response, NextFunction } from "express";
import { responseOk } from "../config/responses/app.response";
import chatService from "../services/chat.service";
import { CustomRequest } from "../types/CustomRequest";
import ChatErrorHandler from "../errors/ChatErrorHandler";




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

sendMessage: async (req: CustomRequest, res: Response, next: NextFunction) => {
    try{
        if(!req.userLogged) throw ChatErrorHandler.unauthorized()
        req.body.id_sender = req.userLogged.id_user
        const sendMessage = await chatService.SendMessage(req.body)
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
        responseOk(res, "Mensagens encontradas com sucesso!", sendMessage, 200)
    }
    catch(e) {
        next(e)
    }
},







}




export default chatController