import { Router } from "express";
import postController from "../../controller/post.controller";
import { validate } from "../../middlewares/zodMiddleware";
import authMiddleware from "../../middlewares/authMiddleware";
import { postSchema, postSchemaPartial } from "../../schemas/post.schema";
import { partialUserInputs } from "../../schemas/common_user.schema";



const postRouter = Router()


postRouter.post("/", validate(postSchema), authMiddleware ,postController.post)
postRouter.get("/:id_user",  authMiddleware, postController.findForUniqueKey)
postRouter.get("/", postController.findPosts )
postRouter.put("/:id_post",authMiddleware, validate(postSchemaPartial) ,   postController.putPost)
postRouter.delete("/:id_post", authMiddleware, postController.deletePostByUniqueKey )


// postRouter.post("/profile" , upload.single("image"), postController.postImage )

export default postRouter