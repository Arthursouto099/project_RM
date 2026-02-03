import Router from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import chatController from "../../controller/chat.controller";
import { validate } from "../../middlewares/zodMiddleware";
import { message } from "../../schemas/chat.schema";

const chatRouter = Router();

chatRouter.post(
  "/private/:id_user",
  authMiddleware,
  chatController.createPrivateChat,
);
chatRouter.post(
  "/message",
  authMiddleware,
  validate(message),
  chatController.sendMessage,
);
chatRouter.get("/:id_chat", authMiddleware, chatController.findChatById);

chatRouter.get("/:id_chat/message", authMiddleware, chatController.getMessages);

chatRouter.patch("/join/:id_chat", authMiddleware, chatController.joinChat)
chatRouter.get(
  "/private/:id_user",
  authMiddleware,
  chatController.findPrivateChat,
);

export default chatRouter;
