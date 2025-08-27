import { Router } from "express";
import commonUserController from "../../controller/common_user.controller";
import { validate } from "../../middlewares/zodMiddleware";
import { commonUserSchema } from "../../schemas/common_user.schema";



const commonUserRouter = Router()


commonUserRouter.post("/", validate(commonUserSchema) ,commonUserController.post)
commonUserRouter.get("/",  commonUserController.findForUniqueKey)
commonUserRouter.delete("/",commonUserController.deleteForUniqueKey )


export default commonUserRouter