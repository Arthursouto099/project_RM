import  {Router}  from "express";
import commonUserRouter from "./v1/common_user.router";
import { validate } from "../middlewares/zodMiddleware";
import { commonUserSchema } from "../schemas/common_user.schema";
import * as authRouter from "./v1/auth.router";

const routers = Router();


routers.use("/user", commonUserRouter)
routers.use("/auth", authRouter.default)

export default routers;