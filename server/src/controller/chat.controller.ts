import { Response, NextFunction } from "express";
import { responseOk } from "../config/responses/app.response";
import chatService from "../services/chat.service";
import { CustomRequest } from "../types/CustomRequest";
import ChatErrorHandler from "../errors/ChatErrorHandler";
import { io } from "../app";
import { emitSinalByWebSocket } from "../interfaces/Socket";

const chatController = {
  // vai receber o id do outro usuario pelo parametro
  createPrivateChat: async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.userLogged) throw ChatErrorHandler.unauthorized();
      const createdChat = await chatService.createOrReturnPrivateChat(
        req.userLogged?.id_user,
        req.params.id_user,
      );
      responseOk(res, createdChat.message, createdChat.data, 201);
    } catch (e) {
      next(e);
    }
  },

  joinChat: async (req: CustomRequest, res: Response) => {
    const data = await chatService.addMember({id_chat: req.params.id_chat}, req.userLogged?.id_user as string)
    res.status(200).json({data})
  }
  ,

  findChatById: async (req: CustomRequest, res: Response) => {
    const data = await chatService.findChatById({
      id_chat: req.params.id_chat!,
    });
    res.status(200).json({ data });
  },
  findPrivateChat: async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.userLogged) throw ChatErrorHandler.unauthorized();
      const chat = await chatService.findChat(
        req.userLogged?.id_user,
        req.params.id_user,
      );
      responseOk(res, chat.message, chat.data, 201);
    } catch (e) {
      next(e);
    }
  },

  sendMessage: async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.userLogged) throw ChatErrorHandler.unauthorized();
      req.body.id_sender = req.userLogged.id_user;
      const sendMessage = await chatService.SendMessage(req.body);

      // aviso o IO quando uma nova mensagem e enviada para sala,
      // envio a mensagem nessa sala
      emitSinalByWebSocket({
        io,
        toString: sendMessage.id_chat,
        emitString: "newMessage",
        args: sendMessage,
      });

      responseOk(res, "Messagem enviada com sucesso!", sendMessage, 201);
    } catch (e) {
      next(e);
    }
  },

  getMessages: async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.userLogged) throw ChatErrorHandler.unauthorized();
      const sendMessage = await chatService.getPrivateMessas(
        req.params.id_chat,
        {
          page: Number(req.query.page ?? 1),
          limit: Number(req.query.limit ?? 20),
        },
      );

      /*
        Estou definindo que ao receber a mensagem  eu emito para a minha sala IO 
        {IO DO APP} algumas informações  como o chatID e o timeStamp

        /*/
      emitSinalByWebSocket({
        io,
        toString: req.params.id_chat,
        emitString: "chatViewed",
        args: {
          chatId: req.params.id_chat,
          timeStamp: new Date(),
        },
      });

      responseOk(res, "Mensagens encontradas com sucesso!", sendMessage, 200);
    } catch (e) {
      next(e);
    }
  },
};

export default chatController;
