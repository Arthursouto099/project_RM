import { Router } from "express";
import commonUserController from "../../controller/common_user.controller";



const commonUserRouter = Router()


commonUserRouter.post("/", commonUserController.post)

export default commonUserRouter