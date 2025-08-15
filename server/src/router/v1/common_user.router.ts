import { Router } from "express";
import commonUserController from "../../controller/common_user.controller";



const commonUserRouter = Router()


commonUserRouter.post("/", commonUserController.post)
commonUserRouter.get("/", commonUserController.findForUniqueKey)
commonUserRouter.delete("/",commonUserController.deleteForUniqueKey )


export default commonUserRouter