import  {Router}  from "express";
import commonUserRouter from "./v1/common_user.router";
import { validate } from "../middlewares/zodMiddleware";
import { commonUserSchema } from "../schemas/common_user.schema";

const routers = Router();


routers.use("/user", validate(commonUserSchema), commonUserRouter)

export default routers;