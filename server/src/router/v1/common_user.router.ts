import { Router } from "express";
import commonUserController from "../../controller/common_user.controller";
import { validate } from "../../middlewares/zodMiddleware";
import { commonUserSchema } from "../../schemas/common_user.schema";
import authMiddleware from "../../middlewares/authMiddleware";



const commonUserRouter = Router()


commonUserRouter.post("/", validate(commonUserSchema) ,commonUserController.post)
commonUserRouter.get("/",  authMiddleware, commonUserController.findForUniqueKey)
commonUserRouter.delete("/",commonUserController.deleteForUniqueKey )
commonUserRouter.put("/:id_user", authMiddleware,commonUserController.put )

export default commonUserRouter