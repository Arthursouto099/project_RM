import  {Router}  from "express";
import commonUserRouter from "./v1/common_user.router";

const routers = Router();


routers.use("/user", commonUserRouter)

export default routers;