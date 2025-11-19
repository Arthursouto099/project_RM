import { Router } from "express";
import postController from "../../controller/post.controller";
import { validate } from "../../middlewares/zodMiddleware";
import authMiddleware from "../../middlewares/authMiddleware";
import { postSchema, postSchemaPartial } from "../../schemas/post.schema";
import commentController from "../../controller/comment.controller";



const postRouter = Router()


postRouter.post("/", validate(postSchema), authMiddleware ,postController.post)
postRouter.get("/:id_user",  authMiddleware, postController.findForUniqueKey)
postRouter.get("/", postController.findPosts )
postRouter.put("/:id_post",authMiddleware, validate(postSchemaPartial) ,   postController.putPost)
postRouter.delete("/:id_post", authMiddleware, postController.deletePostByUniqueKey )
postRouter.post("/comment/:id_post", authMiddleware, commentController.createComment)
postRouter.get("/comment/:id_post", commentController.findComments)
postRouter.put("/comment/:id_comment", authMiddleware, commentController.putComment)
postRouter.get("/comment/replies/:id_comment", commentController.findRepliesByParentId)
postRouter.delete("/comment/delete/:id_comment", authMiddleware, commentController.deleteComment )
postRouter.get("/comment/find/:id_comment", authMiddleware, commentController.findComment)


// postRouter.post("/profile" , upload.single("image"), postController.postImage )

export default postRouter