import  {Router}  from "express";
import commonUserRouter from "./v1/common_user.router";
import   * as authRouter from "./v1/auth.router";
import postRouter from "./v1/post.router";
import chatRouter from "./v1/chat.router";
const routers = Router();


routers.use("/user", commonUserRouter)
routers.use("/auth", authRouter.default)
routers.use("/post", postRouter)
routers.use("/chat", chatRouter)

export default routers;