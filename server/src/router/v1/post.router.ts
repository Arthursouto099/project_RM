import { Router } from "express";
import postController from "../../controller/post.controller";
import { validate } from "../../middlewares/zodMiddleware";
import authMiddleware from "../../middlewares/authMiddleware";
import { postSchema } from "../../schemas/post.schema";



const postRouter = Router()


postRouter.post("/", validate(postSchema), authMiddleware ,postController.post)
postRouter.get("/me",  authMiddleware, postController.findForUniqueKey)
postRouter.get("/", postController.findPosts )

// postRouter.post("/profile" , upload.single("image"), postController.postImage )

export default postRouter